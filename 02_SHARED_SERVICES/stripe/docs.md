# 🏦 SHARED STRIPE INFRASTRUCTURE
## Company-Wide Payment System Architecture

**Last Updated:** February 28, 2026  
**Platforms:** marriageducation.com, q4-life.com  
**Platform:** Firebase Cloud Functions + Stripe Connect

---

## 📋 OVERVIEW

This is the **SINGLE SOURCE OF TRUTH** for all Stripe integrations across the company. Any new platform must reuse this infrastructure.

### **Architecture:**
- **Backend:** Firebase Cloud Functions (Node.js)
- **Payment Gateway:** Stripe Checkout Sessions
- **Settlement:** Stripe Connect (for partner splits)
- **Webhooks:** Firebase HTTPS endpoints
- **Environment:** Firebase Functions Config

---

## 🗂️ CURRENT IMPLEMENTATIONS

### 1. **marriageducation.com** ✅ PRODUCTION
- **Purpose:** eBook sales, course enrollments
- **Payment Flow:** Stripe Checkout → Firebase webhook → Auto-enrollment
- **Firebase Function:** `createCheckoutSession`
- **Webhook Handler:** `stripeWebhook`
- **Status:** Fully operational

### 2. **q4-life.com** 🔄 IN PROGRESS  
- **Purpose:** Insurance policy payments with partner splits
- **Payment Flow:** Stripe Connect → Commission extraction → Partner settlement
- **Firebase Function:** To be deployed
- **Webhook Handler:** To be created
- **Status:** Implementing shared architecture

---

## 🔑 STRIPE CONFIGURATION

### **Environment Variables (Firebase Functions Config)**

```bash
# Marriageducation (Production)
firebase use marriage-education
firebase functions:config:set \
  stripe.secret_key="sk_live_51Pw..." \
  stripe.webhook_secret="whsec_..."

# Q4-Life (To be configured)
firebase use q4-life-platform
firebase functions:config:set \
  stripe.secret_key="sk_live_..." \
  stripe.webhook_secret="whsec_..."
```

### **API Keys Storage:**
- ✅ **DO:** Store in Firebase Functions Config (encrypted)
- ✅ **DO:** Use separate keys per project
- ❌ **DON'T:** Commit keys to git
- ❌ **DON'T:** Store in .env files (local only)

---

## 🛠️ SHARED CODE COMPONENTS

### **1. Checkout Session Creation**

**Location:** `functions/index.js`

```javascript
/**
 * STANDARD PATTERN - All platforms use this structure
 */
exports.createCheckoutSession = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }
  
  try {
    const { product_id, name, price, currency } = req.body;
    
    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: currency || 'usd',
          product_data: { name },
          unit_amount: Math.round(price * 100) // Convert to cents
        },
        quantity: 1
      }],
      mode: 'payment',
      success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/cancel.html`,
      metadata: { product_id } // Critical for webhook processing
    });
    
    res.json({ url: session.url });
  } catch (error) {
    console.error('[Stripe] Error:', error);
    res.status(500).json({ error: error.message });
  }
});
```

### **2. Webhook Handler**

```javascript
/**
 * STANDARD PATTERN - Verify signatures, process events
 */
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = functions.config().stripe?.webhook_secret;

  try {
    // Verify webhook signature (CRITICAL FOR SECURITY)
    const event = stripe.webhooks.constructEvent(
      req.rawBody, sig, webhookSecret
    );

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Extract metadata
      const productId = session.metadata?.product_id;
      const customerEmail = session.customer_details?.email;
      
      // Process fulfillment (platform-specific logic here)
      await fulfillOrder(productId, customerEmail, session);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('[Webhook] Error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});
```

### **3. Frontend Integration**

**Location:** `public/checkout.js`

```javascript
/**
 * STANDARD PATTERN - All platforms use this approach
 */
async function createCheckoutSession(productId, price, currency = 'usd') {
  const isLocal = window.location.hostname === 'localhost';
  
  const apiUrl = isLocal 
    ? 'http://localhost:5001/YOUR-PROJECT/us-central1/createCheckoutSession'
    : 'https://us-central1-YOUR-PROJECT.cloudfunctions.net/createCheckoutSession';
  
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product_id: productId, price, currency })
  });

  const { url } = await response.json();
  window.location.href = url; // Redirect to Stripe Checkout
}
```

---

## 🔐 SECURITY BEST PRACTICES

### **1. Webhook Signature Verification**
- ✅ **ALWAYS** verify `stripe-signature` header
- ❌ **NEVER** process webhooks without verification
- 🔒 Prevents malicious requests

### **2. API Key Management**
- ✅ Use Firebase Functions Config (encrypted at rest)
- ✅ Rotate keys quarterly
- ✅ Use test keys in development
- ❌ Never commit keys to repositories

### **3. CORS Configuration**
- ✅ Restrict origins in production
- ✅ Allow `*` only in development
- ✅ Validate request origins

### **4. Idempotency**
- ✅ Use `idempotency_key` in Stripe API calls
- 🔒 Prevents duplicate charges on retries

---

## 🚀 DEPLOYMENT CHECKLIST

### **Prerequisites:**
- [ ] Firebase project created
- [ ] Stripe account created
- [ ] Firebase CLI installed
- [ ] Billing enabled (Blaze plan required for external API calls)

### **Steps:**
1. **Install Dependencies**
   ```bash
   cd functions/
   npm install stripe firebase-functions firebase-admin
   ```

2. **Configure Stripe Keys**
   ```bash
   firebase functions:config:set \
     stripe.secret_key="sk_live_..." \
     stripe.webhook_secret="whsec_..."
   ```

3. **Deploy Functions**
   ```bash
   firebase deploy --only functions:createCheckoutSession,functions:stripeWebhook
   ```

4. **Configure Stripe Webhook**
   - Go to: https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://us-central1-YOUR-PROJECT.cloudfunctions.net/stripeWebhook`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`
   - Copy webhook secret to Firebase config

5. **Test Integration**
   - Use Stripe test keys first
   - Test cards: `4242 4242 4242 4242`
   - Verify webhook receives events

---

## 📊 MONITORING

### **Firebase Console**
- Functions logs: Check for errors
- Performance: Monitor latency, cold starts
- Quotas: Ensure not hitting limits

### **Stripe Dashboard**
- Payments: Monitor successful charges
- Webhooks: Check delivery success rates
- Logs: Investigate failed payments

---

## 🆘 TROUBLESHOOTING

### **Error: "No such webhook endpoint"**
- **Cause:** Webhook not configured in Stripe
- **Fix:** Add Firebase Function URL to Stripe webhook settings

### **Error: "Invalid signature"**
- **Cause:** Wrong webhook secret
- **Fix:** Copy correct secret from Stripe → Firebase config

### **Error: "Billing account not configured"**
- **Cause:** Free plan doesn't allow external API calls
- **Fix:** Upgrade to Blaze plan in Firebase Console

---

## 📞 SUPPORT

**CTO & Payment Systems Architect:** GitHub Copilot  
**Role:** Maintain unified Stripe integration across all platforms

**When adding new platform:**
1. Review this document
2. Copy standard patterns
3. Configure environment variables
4. Deploy and test
5. Update this documentation

---

## 🔄 VERSION HISTORY

| Date | Platform | Change |
|------|----------|--------|
| 2026-02-28 | ALL | Created shared infrastructure documentation |
| 2026-02-27 | marriageducation | Migrated from Ruby to Firebase Functions |
| 2026-02-28 | q4-life | Planning implementation |

---

**Remember:** This is the SINGLE SOURCE OF TRUTH. Any deviation must be documented here.
