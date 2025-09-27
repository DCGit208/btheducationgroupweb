# frozen_string_literal: true
# Stripe backend for BTH (Sinatra): dynamic catalog via Stripe Prices (lookup_key = SKU),
# promo codes, receipt_email, and preview endpoint.
# ENV required:
#   STRIPE_SECRET_KEY=sk_live_... or sk_test_...
#   STRIPE_PUBLISHABLE_KEY=pk_live_... or pk_test_...
#   WEBHOOK_SECRET=whsec_...   (from Stripe CLI/dashboard)
#   ALLOWED_ORIGIN=https://new.btheducationgroup.org   (your payment.html origin)
require 'sinatra'
require 'sinatra/json'
require 'stripe'
require 'json'

set :bind, '0.0.0.0'

Stripe.api_key = ENV.fetch('STRIPE_SECRET_KEY')

helpers do
  def allowed_origin?
    origin = request.env['HTTP_ORIGIN']
    allowed = ENV['ALLOWED_ORIGIN']
    allowed.nil? || origin == allowed
  end

  def cors!
    headers['Access-Control-Allow-Origin'] = ENV['ALLOWED_ORIGIN'] || '*'
    headers['Access-Control-Allow-Headers'] = 'Content-Type'
    headers['Access-Control-Allow-Methods'] = 'GET,POST,OPTIONS'
  end

  def price_for_sku(sku)
    res = Stripe::Price.list({ lookup_keys: [sku], expand: ['data.product'], limit: 1 })
    res.data.first
  end

  def compute_discount(amount, currency, promo_code)
    return [0, nil] if promo_code.to_s.strip.empty?
    promos = Stripe::PromotionCode.list({ code: promo_code, active: true, limit: 1 })
    pc = promos.data.first
    return [0, nil] unless pc

    c = pc.coupon
    discount = 0
    if c.percent_off
      discount = (amount * c.percent_off / 100.0).floor
    elsif c.amount_off && (c.currency.nil? || c.currency.to_s.downcase == currency.to_s.downcase)
      discount = c.amount_off
    end
    discount = 0 if discount < 0
    [discount, pc.id]
  end
end

before { cors! }
options '*' do 200 end

get '/config' do
  halt 403, 'Forbidden' unless allowed_origin?
  json publishableKey: ENV.fetch('STRIPE_PUBLISHABLE_KEY')
end

# Dynamic catalog
get '/catalog' do
  halt 403, 'Forbidden' unless allowed_origin?
  sku = params['sku']
  halt 400, json(error: 'Missing sku') unless sku
  price = price_for_sku(sku)
  halt 404, json(error: 'Unknown SKU') unless price
  prod = price.product
  json name: (prod['name'] || sku), description: prod['description'], amount: price.unit_amount, currency: price.currency
end

# Preview discounted amount (UX optimization)
post '/preview-amount' do
  halt 403, 'Forbidden' unless allowed_origin?
  data = JSON.parse(request.body.read) rescue {}
  sku = data['sku']
  promo = data['promo']
  price = price_for_sku(sku)
  halt 404, json(error: 'Unknown SKU') unless price
  amount = price.unit_amount
  discount, _ = compute_discount(amount, price.currency, promo)
  json amount: [amount - discount, 50].max, currency: price.currency, discount: discount
end

# Create PaymentIntent with promo + email receipts
post '/create-payment-intent' do
  halt 403, 'Forbidden' unless allowed_origin?
  data = JSON.parse(request.body.read) rescue {}
  sku   = data['sku']
  email = data['email']
  promo = data['promo']

  price = price_for_sku(sku)
  halt 404, json(error: 'Unknown SKU') unless price
  amount = price.unit_amount
  currency = price.currency

  discount, promo_id = compute_discount(amount, currency, promo)
  final_amount = [amount - discount, 50].max # don't allow < $0.50

  intent = Stripe::PaymentIntent.create(
    amount: final_amount,
    currency: currency,
    automatic_payment_methods: { enabled: true },
    description: price.product['name'],
    receipt_email: email, # Stripe will email receipt automatically if enabled in Dashboard
    metadata: { sku: sku, price_id: price.id, promo: promo.to_s, promo_id: promo_id.to_s }
  )

  json clientSecret: intent.client_secret, amount: final_amount, currency: currency, discount: discount
end

# Webhook for fulfillment
post '/webhook' do
  payload = request.body.read
  sig_header = request.env['HTTP_STRIPE_SIGNATURE']
  endpoint_secret = ENV['WEBHOOK_SECRET']

  event = nil
  begin
    event = Stripe::Webhook.construct_event(payload, sig_header, endpoint_secret)
  rescue JSON::ParserError
    halt 400, 'Invalid payload'
  rescue Stripe::SignatureVerificationError
    halt 400, 'Invalid signature'
  end

  case event['type']
  when 'payment_intent.succeeded'
    intent = event['data']['object']
    sku    = intent['metadata']['sku']
    email  = intent['receipt_email']
    # TODO: enroll student, send internal notification, etc.
    STDERR.puts "FULFILL: sku=#{sku} email=#{email} amount=#{intent['amount']}"
  when 'payment_intent.payment_failed'
    intent = event['data']['object']
    STDERR.puts "FAILED: #{intent['last_payment_error']&.dig('message')}"
  end

  status 200
end
