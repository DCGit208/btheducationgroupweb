# BTH Stripe Advanced Starter (Payment Element + Promo + Receipts + Dynamic Catalog)

This bundle gives you:
- **One payment page** for all products: `/frontend/payment.html?sku=...`
- **Dynamic products & prices** from Stripe (set `lookup_key = SKU` on your Price)
- **Promo codes** (Stripe Promotion Codes/Coupons)
- **Email receipts** (via `receipt_email` + Stripe Dashboard setting)
- **Webhooks** for fulfillment

---

## 1) Stripe Dashboard setup

1. **Create Products & Prices**
   - Products → Add product (e.g., "OEDP: IT Level 1")
   - Add a Price (standard one-time), set **Lookup key** to your SKU (e.g., `oedp-it-level1`)
   - Repeat for each SKU.

2. **Enable email receipts** (Stripe Dashboard → Settings → Email receipts):
   - Toggle **Email customers for successful payments** ON.

3. **Promo codes** (optional):
   - Coupons → Create (percent_off or amount_off)
   - Promotion codes → Create, link to the coupon, set the code (e.g., `BTH10`), and mark **Active**.

4. **API keys**:
   - Get **Secret key** (`sk_test_...` / `sk_live_...`)
   - Get **Publishable key** (`pk_test_...` / `pk_live_...`)

---

## 2) Deploy backend (Ruby/Sinatra) to Heroku

```bash
cd backend-ruby
heroku create bth-stripe-backend
heroku buildpacks:add heroku/ruby

# Replace ALLOWED_ORIGIN with your site (subdomain) that serves payment.html
heroku config:set STRIPE_SECRET_KEY=sk_test_xxx STRIPE_PUBLISHABLE_KEY=pk_test_xxx ALLOWED_ORIGIN=https://new.btheducationgroup.org

# (After running `stripe listen`, set your whsec)
heroku config:set WEBHOOK_SECRET=whsec_xxx

git init && git add . && git commit -m "BTH Stripe backend"
git push heroku main
```

**Webhook (local forwarding to Heroku):**
```bash
stripe listen --forward-to https://bth-stripe-backend.herokuapp.com/webhook
# Copy the printed whsec_... then run:
heroku config:set WEBHOOK_SECRET=whsec_...
```

---

## 3) Frontend usage

- Put **/frontend** in your site (e.g., `/public_html/new-bth/frontend/`).
- On pages with Buy/Enroll buttons, link to:
  ```
  /frontend/payment.html?sku=<your-sku>
  ```

- If your backend is on a different origin (Heroku), set it before loading `payment.js`:
  ```html
  <script>
    window.BTH_BACKEND = 'https://bth-stripe-backend.herokuapp.com';
  </script>
  <script type="module" src="/frontend/assets/js/payment.js"></script>
  ```

**What users see on payment.html**
- Product info fetched from `/catalog?sku=...`
- Email field (Link Authentication) → used as `receipt_email`
- Promo code input (optional) → preview recalculates, create intent applies discount
- Payment Element → supports cards, wallets, 3DS, etc.

---

## 4) Endpoints summary (backend)

- `GET /config` → `{ publishableKey }`
- `GET /catalog?sku=SKU` → `{ name, description, amount, currency }` (from Stripe Price with `lookup_key=SKU`)
- `POST /preview-amount` → `{ amount, currency, discount }` (applies promo if valid)
- `POST /create-payment-intent` → `{ clientSecret, amount, currency, discount }` (creates PI with promo + receipt_email)
- `POST /webhook` → handle `payment_intent.succeeded` for fulfillment

---

## 5) Customize

- Add more products: just create new Stripe Prices with matching `lookup_key`.
- Change promo UX: only allow certain prefixes (e.g., `BTH-...`).
- Fulfillment: in `/webhook`, enroll student, send internal email/Slack, etc.
- Receipts: Stripe handles the *customer receipt*; you can add your own emails too.

---

## 6) Security notes

- Never expose `sk_*` in frontend.
- All prices are validated server-side via Stripe API (no trust in client amount).
- CORS is limited to `ALLOWED_ORIGIN` (your site) by default.

---

## 7) Test cards

Use Stripe test cards in test mode (e.g., 4242 4242 4242 4242, any future expiry, any CVC, any ZIP).

---

## 8) Moving to live

- Switch Heroku config to live keys (`sk_live_*`, `pk_live_*`).
- Update `ALLOWED_ORIGIN` to your live domain.
- Confirm your Prices in **live mode** have matching lookup keys.
