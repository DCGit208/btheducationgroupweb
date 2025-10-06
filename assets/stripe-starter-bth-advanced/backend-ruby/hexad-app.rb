# Enhanced Stripe backend for HEXAD LMS with dimension-by-dimension payments
# Supports subscription models, one-time payments, and progressive unlocking

require 'sinatra'
require 'sinatra/json'
require 'stripe'
require 'json'
require 'redis' # For storing user progress

set :bind, '0.0.0.0'

Stripe.api_key = ENV.fetch('STRIPE_SECRET_KEY')

# Redis for user progress tracking
redis = Redis.new(url: ENV['REDIS_URL'] || 'redis://localhost:6379')

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

  # HEXAD Pricing Structure
  def hexad_pricing
    {
      levels: {
        1 => { per_dimension: 967.11, professional: 8100.00, duration: "12-24 months" },
        2 => { per_dimension: 1302.33, professional: 10500.00, duration: "24-36 months" },
        3 => { per_dimension: 1928.35, professional: 13500.00, duration: "36 months" },
        4 => { per_dimension: 2408.15, professional: 17000.00, duration: "36-48 months" },
        5 => { per_dimension: 2901.33, professional: 26865.00, duration: "48-60 months" }
      },
      certifications: {
        'comptia' => 320,
        'microsoft' => 165,
        'aws' => 150,
        'cisco' => 300,
        'google' => 200,
        'salesforce' => 250
      },
      dimensions: %w[personal professional occupational financial relationship truth]
    }
  end

  def calculate_hexad_price(level, dimension, certifications = [])
    pricing = hexad_pricing
    
    base_price = if dimension == 'professional'
      pricing[:levels][level][:professional]
    else
      pricing[:levels][level][:per_dimension]
    end
    
    cert_total = certifications.sum { |cert| pricing[:certifications][cert] || 0 }
    
    base_price + cert_total
  end

  def create_hexad_product(level, dimension, certifications = [])
    pricing = hexad_pricing
    total_price = calculate_hexad_price(level, dimension, certifications)
    
    product_name = "HEXAD Level #{level} - #{dimension.capitalize} Development"
    
    if certifications.any?
      cert_names = certifications.map(&:upcase).join(', ')
      product_name += " + #{cert_names} Certifications"
    end
    
    {
      name: product_name,
      description: "Complete #{dimension} development program with #{pricing[:levels][level][:duration]} access",
      amount: (total_price * 100).to_i, # Convert to cents
      currency: 'usd',
      metadata: {
        level: level,
        dimension: dimension,
        certifications: certifications.join(','),
        duration: pricing[:levels][level][:duration]
      }
    }
  end

  def create_subscription_price(level, dimension)
    pricing = hexad_pricing
    annual_price = if dimension == 'professional'
      pricing[:levels][level][:professional]
    else
      pricing[:levels][level][:per_dimension]
    end
    
    monthly_price = (annual_price / 12.0).round(2)
    
    {
      monthly: (monthly_price * 100).to_i,
      annual: (annual_price * 100).to_i
    }
  end
end

before { cors! }
options '*' do 200 end

get '/config' do
  halt 403, 'Forbidden' unless allowed_origin?
  json publishableKey: ENV.fetch('STRIPE_PUBLISHABLE_KEY')
end

# Dynamic HEXAD catalog
get '/hexad-catalog' do
  halt 403, 'Forbidden' unless allowed_origin?
  
  level = params['level'].to_i
  dimension = params['dimension']
  certifications = (params['certifications'] || '').split(',').reject(&:empty?)
  
  halt 400, json(error: 'Invalid level') unless (1..5).include?(level)
  halt 400, json(error: 'Invalid dimension') unless hexad_pricing[:dimensions].include?(dimension)
  
  product = create_hexad_product(level, dimension, certifications)
  json product
end

# Create HEXAD Payment Intent
post '/create-hexad-payment' do
  halt 403, 'Forbidden' unless allowed_origin?
  
  data = JSON.parse(request.body.read) rescue {}
  level = data['level'].to_i
  dimension = data['dimension']
  certifications = data['certifications'] || []
  payment_method = data['payment_method'] # 'full', 'monthly', 'dimension'
  email = data['email']
  
  halt 400, json(error: 'Invalid parameters') unless (1..5).include?(level) && hexad_pricing[:dimensions].include?(dimension)
  
  product = create_hexad_product(level, dimension, certifications)
  total_amount = product[:amount]
  
  # Apply discounts
  case payment_method
  when 'full'
    # 5% discount for full payment
    total_amount = (total_amount * 0.95).to_i
    payment_type = 'one_time'
  when 'monthly'
    # Split into 12 monthly payments
    total_amount = (total_amount / 12.0).to_i
    payment_type = 'recurring'
  when 'dimension'
    # Single dimension payment
    payment_type = 'one_time'
  end
  
  if payment_type == 'recurring'
    # Create subscription for monthly payments
    price = Stripe::Price.create(
      unit_amount: total_amount,
      currency: 'usd',
      recurring: { interval: 'month', interval_count: 1 },
      product_data: {
        name: product[:name],
        description: product[:description]
      }
    )
    
    session = Stripe::Checkout::Session.create(
      mode: 'subscription',
      line_items: [{
        price: price.id,
        quantity: 1
      }],
      success_url: "#{ENV['ALLOWED_ORIGIN']}/hexad-success.html?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "#{ENV['ALLOWED_ORIGIN']}/hexad-checkout-system.html",
      customer_email: email,
      metadata: product[:metadata].merge({
        payment_method: payment_method,
        payment_type: 'subscription'
      })
    )
    
    json checkout_url: session.url, session_id: session.id
  else
    # Create one-time payment
    intent = Stripe::PaymentIntent.create(
      amount: total_amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      description: product[:name],
      receipt_email: email,
      metadata: product[:metadata].merge({
        payment_method: payment_method,
        payment_type: 'one_time'
      })
    )
    
    json client_secret: intent.client_secret, amount: total_amount
  end
end

# User Progress Tracking
post '/track-progress' do
  halt 403, 'Forbidden' unless allowed_origin?
  
  data = JSON.parse(request.body.read) rescue {}
  user_email = data['email']
  level = data['level']
  dimension = data['dimension']
  module_completed = data['module']
  
  progress_key = "user:#{user_email}:progress"
  current_progress = JSON.parse(redis.get(progress_key) || '{}')
  
  current_progress[dimension] ||= { level: level, completed_modules: [] }
  current_progress[dimension][:completed_modules] << module_completed
  current_progress[dimension][:completed_modules].uniq!
  
  redis.set(progress_key, current_progress.to_json)
  
  # Check if dimension is complete and unlock next dimension
  total_modules = 18 # Each dimension has 18 modules
  if current_progress[dimension][:completed_modules].length >= total_modules
    current_progress[:unlocked_dimensions] ||= []
    current_progress[:unlocked_dimensions] << get_next_dimension(dimension)
    redis.set(progress_key, current_progress.to_json)
  end
  
  json success: true, progress: current_progress
end

get '/user-progress/:email' do
  halt 403, 'Forbidden' unless allowed_origin?
  
  email = params['email']
  progress_key = "user:#{email}:progress"
  progress = JSON.parse(redis.get(progress_key) || '{}')
  
  json progress: progress
end

# LMS Access Control
get '/lms-access/:email' do
  halt 403, 'Forbidden' unless allowed_origin?
  
  email = params['email']
  
  # Check payment history
  payments = Stripe::PaymentIntent.list(
    limit: 100,
    metadata: { user_email: email }
  )
  
  subscriptions = Stripe::Subscription.list(
    limit: 100,
    customer: email
  )
  
  access_levels = {}
  payments.data.each do |payment|
    next unless payment.status == 'succeeded'
    
    level = payment.metadata['level']
    dimension = payment.metadata['dimension']
    
    access_levels[dimension] = level if level && dimension
  end
  
  json access_levels: access_levels, has_active_subscription: subscriptions.data.any? { |s| s.status == 'active' }
end

# Webhook for payment processing
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
    handle_payment_success(intent)
    
  when 'invoice.payment_succeeded'
    invoice = event['data']['object']
    handle_subscription_payment(invoice)
    
  when 'customer.subscription.deleted'
    subscription = event['data']['object']
    handle_subscription_cancelled(subscription)
  end

  status 200
end

private

def handle_payment_success(intent)
  level = intent['metadata']['level']
  dimension = intent['metadata']['dimension']
  email = intent['receipt_email']
  
  # Grant LMS access
  access_key = "user:#{email}:access"
  current_access = JSON.parse(redis.get(access_key) || '{}')
  current_access[dimension] = level
  redis.set(access_key, current_access.to_json)
  
  # Send welcome email with LMS access
  send_lms_welcome_email(email, level, dimension)
  
  STDERR.puts "HEXAD ACCESS GRANTED: #{email} - Level #{level} #{dimension}"
end

def handle_subscription_payment(invoice)
  customer_email = invoice['customer_email']
  subscription = invoice['subscription']
  
  # Grant ongoing access for subscription
  STDERR.puts "SUBSCRIPTION PAYMENT: #{customer_email} - #{subscription}"
end

def handle_subscription_cancelled(subscription)
  # Maintain access to completed content but stop new content access
  STDERR.puts "SUBSCRIPTION CANCELLED: #{subscription['id']}"
end

def send_lms_welcome_email(email, level, dimension)
  # Integration with email service (SendGrid, Mailgun, etc.)
  STDERR.puts "WELCOME EMAIL: #{email} - Level #{level} #{dimension}"
end

def get_next_dimension(current_dimension)
  dimensions = %w[personal professional occupational financial relationship truth]
  current_index = dimensions.index(current_dimension)
  return nil if current_index.nil? || current_index >= dimensions.length - 1
  
  dimensions[current_index + 1]
end