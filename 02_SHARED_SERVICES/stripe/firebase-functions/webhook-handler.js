/**
 * SHARED STRIPE WEBHOOK HANDLER
 * 
 * Standalone webhook processor that can be deployed to any Firebase project.
 * Handles common webhook events and provides hooks for custom logic.
 * 
 * Last Updated: February 28, 2026
 * Version: 1.0.0
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const stripe = require('stripe')(functions.config().stripe?.secret_key);

/**
 * Main webhook endpoint
 * Configure in Stripe Dashboard: https://dashboard.stripe.com/webhooks
 * 
 * Events to enable:
 * - checkout.session.completed
 * - payment_intent.succeeded
 * - payment_intent.payment_failed
 * - customer.subscription.created
 * - customer.subscription.updated
 * - customer.subscription.deleted
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = functions.config().stripe?.webhook_secret;

  if (!webhookSecret) {
    console.error('[Webhook] ERROR: webhook_secret not configured');
    console.error('[Webhook] Run: firebase functions:config:set stripe.webhook_secret="whsec_..."');
    return res.status(500).send('Webhook secret not configured');
  }

  let event;

  try {
    // Verify webhook signature (CRITICAL FOR SECURITY)
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('[Webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  const timestamp = new Date().toISOString();
  console.log(`[Webhook] ${timestamp} - Event received: ${event.type} (${event.id})`);

  // Process event
  try {
    await processWebhookEvent(event);
    res.json({ received: true, event_id: event.id });
  } catch (error) {
    console.error(`[Webhook] Processing error for ${event.type}:`, error);
    res.status(500).json({ error: error.message, event_id: event.id });
  }
});

/**
 * Route webhook events to appropriate handlers
 */
async function processWebhookEvent(event) {
  const handlers = {
    'checkout.session.completed': handleCheckoutCompleted,
    'payment_intent.succeeded': handlePaymentSucceeded,
    'payment_intent.payment_failed': handlePaymentFailed,
    'charge.succeeded': handleChargeSucceeded,
    'charge.failed': handleChargeFailed,
    'customer.subscription.created': handleSubscriptionCreated,
    'customer.subscription.updated': handleSubscriptionUpdated,
    'customer.subscription.deleted': handleSubscriptionDeleted,
    'invoice.paid': handleInvoicePaid,
    'invoice.payment_failed': handleInvoicePaymentFailed,
  };

  const handler = handlers[event.type];
  
  if (handler) {
    await handler(event.data.object, event);
  } else {
    console.log(`[Webhook] No handler for event type: ${event.type}`);
  }
}

/**
 * =====================================================
 * EVENT HANDLERS
 * =====================================================
 */

/**
 * Handle completed checkout session
 * This is the most important event - customer has paid successfully
 */
async function handleCheckoutCompleted(session, event) {
  const db = admin.firestore();
  
  const paymentInfo = {
    stripe_session_id: session.id,
    stripe_payment_intent: session.payment_intent,
    customer_email: session.customer_details?.email,
    customer_name: session.customer_details?.name,
    amount_paid: session.amount_total / 100,
    currency: session.currency,
    payment_status: session.payment_status,
    product_id: session.metadata?.product_id,
    metadata: session.metadata,
    created_at: admin.firestore.FieldValue.serverTimestamp(),
    webhook_event_id: event.id
  };
  
  console.log('[Webhook] Checkout completed:', {
    session_id: session.id,
    email: paymentInfo.customer_email,
    amount: paymentInfo.amount_paid,
    product: paymentInfo.product_id
  });
  
  // Save to Firestore
  await db.collection('stripe_payments').doc(session.id).set(paymentInfo);
  
  // **FULFILLMENT HOOK - CUSTOMIZE FOR YOUR PLATFORM**
  // This is where you grant access, send product, enroll user, etc.
  
  if (session.payment_status === 'paid') {
    await fulfillOrder(paymentInfo);
  }
}

/**
 * Handle successful payment intent
 */
async function handlePaymentSucceeded(paymentIntent, event) {
  console.log('[Webhook] Payment succeeded:', paymentIntent.id, 'amount:', paymentIntent.amount / 100);
  
  // Add your logic here
  // Example: Update order status, send notifications
}

/**
 * Handle failed payment
 */
async function handlePaymentFailed(paymentIntent, event) {
  console.error('[Webhook] Payment failed:', {
    payment_intent: paymentIntent.id,
    amount: paymentIntent.amount / 100,
    error: paymentIntent.last_payment_error?.message
  });
  
  // Add your logic here
  // Example: Notify customer, retry logic, log failure
}

/**
 * Handle successful charge
 */
async function handleChargeSucceeded(charge, event) {
  console.log('[Webhook] Charge succeeded:', charge.id, 'amount:', charge.amount / 100);
  
  // Add your logic here
}

/**
 * Handle failed charge
 */
async function handleChargeFailed(charge, event) {
  console.error('[Webhook] Charge failed:', {
    charge_id: charge.id,
    amount: charge.amount / 100,
    error: charge.failure_message
  });
  
  // Add your logic here
}

/**
 * Handle new subscription
 */
async function handleSubscriptionCreated(subscription, event) {
  const db = admin.firestore();
  
  console.log('[Webhook] Subscription created:', subscription.id);
  
  await db.collection('subscriptions').doc(subscription.id).set({
    stripe_subscription_id: subscription.id,
    customer_id: subscription.customer,
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
    cancel_at_period_end: subscription.cancel_at_period_end,
    created_at: admin.firestore.FieldValue.serverTimestamp()
  });
}

/**
 * Handle subscription update
 */
async function handleSubscriptionUpdated(subscription, event) {
  const db = admin.firestore();
  
  console.log('[Webhook] Subscription updated:', subscription.id, 'status:', subscription.status);
  
  await db.collection('subscriptions').doc(subscription.id).update({
    status: subscription.status,
    current_period_start: new Date(subscription.current_period_start * 1000),
    current_period_end: new Date(subscription.current_period_end * 1000),
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: admin.firestore.FieldValue.serverTimestamp()
  });
}

/**
 * Handle subscription cancellation
 */
async function handleSubscriptionDeleted(subscription, event) {
  const db = admin.firestore();
  
  console.log('[Webhook] Subscription deleted:', subscription.id);
  
  await db.collection('subscriptions').doc(subscription.id).update({
    status: 'canceled',
    canceled_at: admin.firestore.FieldValue.serverTimestamp()
  });
  
  // Revoke access, send cancellation email, etc.
}

/**
 * Handle paid invoice
 */
async function handleInvoicePaid(invoice, event) {
  console.log('[Webhook] Invoice paid:', invoice.id, 'amount:', invoice.amount_paid / 100);
  
  // Add your logic here
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice, event) {
  console.error('[Webhook] Invoice payment failed:', {
    invoice_id: invoice.id,
    amount_due: invoice.amount_due / 100,
    customer: invoice.customer
  });
  
  // Add your logic here
  // Example: Send payment failure notification
}

/**
 * =====================================================
 * FULFILLMENT LOGIC (CUSTOMIZE FOR YOUR PLATFORM)
 * =====================================================
 */

/**
 * Fulfill order after successful payment
 * **CUSTOMIZE THIS FUNCTION FOR YOUR PLATFORM**
 */
async function fulfillOrder(paymentInfo) {
  console.log('[Fulfillment] Processing order for:', paymentInfo.customer_email);
  
  const db = admin.firestore();
  const productId = paymentInfo.product_id;
  
  // Example fulfillment logic (customize for your needs)
  
  try {
    // 1. Grant product access
    // await grantProductAccess(paymentInfo.customer_email, productId);
    
    // 2. Send confirmation email
    // await sendConfirmationEmail(paymentInfo);
    
    // 3. Update user record
    // await updateUserPurchases(paymentInfo.customer_email, productId);
    
    // 4. Log fulfillment
    await db.collection('order_fulfillments').add({
      payment_id: paymentInfo.stripe_session_id,
      customer_email: paymentInfo.customer_email,
      product_id: productId,
      status: 'fulfilled',
      fulfilled_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('[Fulfillment] ✅ Order fulfilled successfully');
    
  } catch (error) {
    console.error('[Fulfillment] ❌ Error:', error);
    
    // Log failure for manual review
    await db.collection('order_fulfillments').add({
      payment_id: paymentInfo.stripe_session_id,
      customer_email: paymentInfo.customer_email,
      product_id: productId,
      status: 'failed',
      error: error.message,
      failed_at: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Don't throw - we don't want Stripe to retry webhook
    // Instead, implement a manual retry system
  }
}

/**
 * =====================================================
 * UTILITY FUNCTIONS
 * =====================================================
 */

/**
 * Send email notification (implement based on your email service)
 */
async function sendEmail(to, subject, htmlBody) {
  // Implement using SendGrid, Mailgun, SMTP, etc.
  console.log('[Email] Would send to:', to, 'subject:', subject);
}

/**
 * Log webhook event for debugging
 */
async function logWebhookEvent(event) {
  const db = admin.firestore();
  
  await db.collection('webhook_logs').add({
    event_id: event.id,
    event_type: event.type,
    received_at: admin.firestore.FieldValue.serverTimestamp(),
    data: event.data.object
  });
}

module.exports = {
  stripeWebhook: exports.stripeWebhook
};
