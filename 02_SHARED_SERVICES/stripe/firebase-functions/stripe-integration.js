/**
 * SHARED STRIPE INTEGRATION - Firebase Cloud Functions
 * 
 * This is the STANDARD implementation for all platforms.
 * Copy this file to your functions/stripe-integration.js
 * 
 * Last Updated: February 28, 2026
 * Version: 1.0.0
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');

// Initialize Stripe with secret key from Firebase config
const stripe = require('stripe')(functions.config().stripe?.secret_key);

/**
 * =====================================================
 * CHECKOUT SESSION CREATION
 * =====================================================
 * 
 * Standard endpoint for creating Stripe Checkout Sessions.
 * All platforms use this same pattern.
 * 
 * Usage:
 * POST https://us-central1-YOUR-PROJECT.cloudfunctions.net/createCheckoutSession
 * Body: { product_id, name, price, currency }
 */
exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  // Enable CORS
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }
  
  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    const { product_id, name, price, currency, metadata } = req.body;
    
    // Validate required fields
    if (!product_id || !name || !price) {
      return res.status(400).json({ 
        error: 'Missing required fields: product_id, name, price' 
      });
    }
    
    console.log('[Stripe] Creating checkout session:', { product_id, name, price, currency });
    
    // Convert price to cents (Stripe uses smallest currency unit)
    const priceInCents = Math.round(parseFloat(price) * 100);
    
    // Validate minimum Stripe amount ($0.50 = 50 cents)
    if (priceInCents < 50) {
      throw new Error('Price too low. Minimum is $0.50 USD');
    }
    
    const finalCurrency = (currency || 'usd').toLowerCase();
    
    // Get domain from config (set via: firebase functions:config:set app.domain="...")
    const YOUR_DOMAIN = functions.config().app?.domain || 'https://localhost:8080';
    
    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: finalCurrency,
          product_data: {
            name: name,
          },
          unit_amount: priceInCents,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}&product=${product_id}`,
      cancel_url: `${YOUR_DOMAIN}/payment.html?cancelled=true`,
      metadata: {
        product_id: product_id,
        ...metadata // Allow additional metadata
      }
    });
    
    console.log('[Stripe] ✅ Checkout session created:', session.id);
    
    // Return redirect URL
    res.json({ url: session.url });
    
  } catch (error) {
    console.error('[Stripe] ❌ Checkout error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

/**
 * =====================================================
 * WEBHOOK HANDLER
 * =====================================================
 * 
 * Receives and processes Stripe webhook events.
 * CRITICAL: Always verify webhook signatures for security.
 * 
 * Setup:
 * 1. Go to: https://dashboard.stripe.com/webhooks
 * 2. Add endpoint: https://us-central1-YOUR-PROJECT.cloudfunctions.net/stripeWebhook
 * 3. Select events: checkout.session.completed, payment_intent.succeeded
 * 4. Copy webhook secret
 * 5. Set config: firebase functions:config:set stripe.webhook_secret="whsec_..."
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = functions.config().stripe?.webhook_secret;

  if (!webhookSecret) {
    console.error('[Webhook] ❌ Webhook secret not configured');
    return res.status(500).send('Webhook secret not configured');
  }

  let event;

  try {
    // SECURITY: Verify webhook signature
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('[Webhook] ❌ Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log('[Webhook] ✅ Received event:', event.type, 'id:', event.id);

  // Handle different event types
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;
        
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object);
        break;
        
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
        
      default:
        console.log('[Webhook] Unhandled event type:', event.type);
    }
    
    res.json({ received: true });
  } catch (error) {
    console.error('[Webhook] ❌ Processing error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * =====================================================
 * WEBHOOK EVENT HANDLERS
 * =====================================================
 * 
 * Customize these functions for your platform's needs.
 */

/**
 * Handle successful checkout session
 * This is where you fulfill the order (grant access, send product, etc.)
 */
async function handleCheckoutCompleted(session) {
  console.log('[Webhook] Processing checkout.session.completed:', session.id);
  
  const db = admin.firestore();
  
  // Extract important data
  const productId = session.metadata?.product_id;
  const customerEmail = session.customer_details?.email;
  const customerName = session.customer_details?.name;
  const amountPaid = session.amount_total / 100; // Convert cents to dollars
  const currency = session.currency;
  const paymentStatus = session.payment_status;
  
  console.log('[Webhook] Customer:', customerEmail, 'Product:', productId, 'Amount:', amountPaid, currency);
  
  if (paymentStatus !== 'paid') {
    console.log('[Webhook] Payment not completed, skipping fulfillment');
    return;
  }
  
  // ⚠️ CUSTOMIZE THIS SECTION FOR YOUR PLATFORM ⚠️
  
  try {
    // Example: Create order record
    await db.collection('orders').add({
      stripe_session_id: session.id,
      product_id: productId,
      customer_email: customerEmail,
      customer_name: customerName,
      amount_paid: amountPaid,
      currency: currency,
      status: 'completed',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Example: Send confirmation email
    // await sendOrderConfirmationEmail(customerEmail, productId);
    
    // Example: Grant product access
    // await grantProductAccess(customerEmail, productId);
    
    console.log('[Webhook] ✅ Order fulfilled for:', customerEmail);
    
  } catch (error) {
    console.error('[Webhook] ❌ Fulfillment error:', error);
    throw error;
  }
}

/**
 * Handle successful payment intent
 * Use this for additional payment-related logic
 */
async function handlePaymentSucceeded(paymentIntent) {
  console.log('[Webhook] Processing payment_intent.succeeded:', paymentIntent.id);
  
  // Add your logic here
  // Example: Update analytics, send notifications, etc.
}

/**
 * Handle failed payment
 * Use this to notify customer or retry
 */
async function handlePaymentFailed(paymentIntent) {
  console.log('[Webhook] Processing payment_intent.payment_failed:', paymentIntent.id);
  
  // Add your logic here
  // Example: Send failure email, log for retry, etc.
}

/**
 * =====================================================
 * STRIPE CONNECT FUNCTIONS (For marketplace/splits)
 * =====================================================
 * 
 * Use these if you need to split payments with partners.
 * Example: Q4-Life insurance commission splits
 */

/**
 * Create Stripe Connect account for partner
 * Partners use this to onboard and receive payments
 */
exports.createPartnerAccount = functions.https.onCall(async (data, context) => {
  // Verify user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const { email, country, business_type } = data;
  
  try {
    // Create Stripe Connect Express account
    const account = await stripe.accounts.create({
      type: 'express',
      country: country || 'US',
      email: email,
      business_type: business_type || 'company',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });
    
    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${functions.config().app?.domain}/partner/reauth`,
      return_url: `${functions.config().app?.domain}/partner/dashboard`,
      type: 'account_onboarding',
    });
    
    // Save account ID to Firestore
    const db = admin.firestore();
    await db.collection('partner_accounts').doc(context.auth.uid).set({
      stripe_account_id: account.id,
      email: email,
      status: 'pending',
      created_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('[Stripe Connect] ✅ Account created:', account.id);
    
    return {
      account_id: account.id,
      onboarding_url: accountLink.url
    };
    
  } catch (error) {
    console.error('[Stripe Connect] ❌ Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * Create payment with automatic split
 * Platform keeps commission, partner receives balance
 */
exports.createSplitPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }
  
  const { amount, partner_account_id, commission_rate, description } = data;
  
  try {
    const grossAmount = parseFloat(amount);
    const commissionAmount = (grossAmount * commission_rate) / 100;
    const partnerAmount = grossAmount - commissionAmount;
    
    // Create payment intent with automatic split
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(grossAmount * 100), // Convert to cents
      currency: 'usd',
      description: description,
      
      // Automatic split to partner
      transfer_data: {
        destination: partner_account_id,
        amount: Math.round(partnerAmount * 100),
      },
      
      // Platform commission (automatically retained)
      application_fee_amount: Math.round(commissionAmount * 100),
    });
    
    console.log('[Split Payment] ✅ Created:', {
      total: grossAmount,
      partner: partnerAmount,
      commission: commissionAmount
    });
    
    return {
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id
    };
    
  } catch (error) {
    console.error('[Split Payment] ❌ Error:', error);
    throw new functions.https.HttpsError('internal', error.message);
  }
});

/**
 * =====================================================
 * UTILITY FUNCTIONS
 * =====================================================
 */

/**
 * Get Stripe publishable key (safe to expose to frontend)
 */
exports.getStripePublicKey = functions.https.onRequest((req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  
  const publishableKey = functions.config().stripe?.publishable_key;
  
  if (!publishableKey) {
    return res.status(500).json({ error: 'Publishable key not configured' });
  }
  
  res.json({ publishable_key: publishableKey });
});

// =====================================================
// EXPORTS
// =====================================================

/**
 * Add these exports to your functions/index.js:
 * 
 * const stripeIntegration = require('./stripe-integration');
 * exports.createCheckoutSession = stripeIntegration.createCheckoutSession;
 * exports.stripeWebhook = stripeIntegration.stripeWebhook;
 * exports.createPartnerAccount = stripeIntegration.createPartnerAccount;
 * exports.createSplitPayment = stripeIntegration.createSplitPayment;
 * exports.getStripePublicKey = stripeIntegration.getStripePublicKey;
 */
