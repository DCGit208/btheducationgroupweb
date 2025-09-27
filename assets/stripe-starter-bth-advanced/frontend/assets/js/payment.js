// Stripe Payment Element client code (advanced: dynamic catalog + promo + receipts)
const BACKEND_BASE = (window.BTH_BACKEND || '');
const qs = new URLSearchParams(location.search);
const sku = qs.get('sku');
let product, clientSecret, stripe, elements;
let emailAddress = '';

const money = (cents, currency) =>
  new Intl.NumberFormat(undefined, {style:'currency', currency}).format((cents||0)/100);

async function loadCatalog() {
  if (!sku) throw new Error('Missing ?sku=...');
  const res = await fetch(`${BACKEND_BASE}/catalog?sku=${encodeURIComponent(sku)}`, {cache:'no-store'});
  if (!res.ok) throw new Error('Unknown SKU');
  product = await res.json(); // {name, description, amount, currency}
  document.getElementById('prod-name').textContent = product.name;
  document.getElementById('prod-desc').textContent = product.description || '';
  document.getElementById('prod-price').textContent = money(product.amount, product.currency);
}

async function start() {
  try {
    await loadCatalog();
  } catch (e) {
    document.getElementById('error-message').textContent = e.message;
    document.getElementById('submit').disabled = true;
    return;
  }

  // 1) fetch publishable key
  const keyRes = await fetch(`${BACKEND_BASE}/config`);
  const { publishableKey } = await keyRes.json();
  stripe = Stripe(publishableKey);

  // 2) create PaymentIntent for this SKU (+ optional promo + email)
  const promo = (document.getElementById('promo')?.value || '').trim();
  const piRes = await fetch(`${BACKEND_BASE}/create-payment-intent`, {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ sku, email: emailAddress || null, promo: promo || null })
  });
  const data = await piRes.json();
  if (!piRes.ok) {
    document.getElementById('error-message').textContent = data.error || 'Unable to start payment.';
    document.getElementById('submit').disabled = true;
    return;
  }
  clientSecret = data.clientSecret;
  if (data.amount && data.currency) {
    document.getElementById('prod-price').textContent = money(data.amount, data.currency);
    if (data.discount && data.discount > 0) {
      document.getElementById('promo-status').textContent = `Promo applied: -${money(data.discount, data.currency)}`;
    }
  }

  // 3) mount Payment + Link Authentication Elements
  elements = stripe.elements({ appearance: { theme: 'stripe' }, clientSecret });
  const linkAuth = elements.create('linkAuthentication');
  linkAuth.mount('#link-authentication-element');
  linkAuth.on('change', (event) => {
    emailAddress = event.value?.email || '';
  });

  const paymentElement = elements.create('payment');
  paymentElement.mount('#payment-element');

  // 4) on submit, confirm payment
  const form = document.getElementById('payment-form');
  const button = document.getElementById('submit');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    button.disabled = true;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/frontend/success.html',
        // Pass email to billing details if collected
        payment_method_data: emailAddress ? { billing_details: { email: emailAddress } } : undefined
      }
    });

    if (error) {
      document.getElementById('error-message').textContent = error.message || 'Payment failed.';
      button.disabled = false;
    }
  });

  // Recalculate when promo changes (optional UX improvement)
  const promoInput = document.getElementById('promo');
  promoInput?.addEventListener('change', async () => {
    const code = promoInput.value.trim();
    const res = await fetch(`${BACKEND_BASE}/preview-amount`, {
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ sku, promo: code || null })
    });
    if (res.ok) {
      const j = await res.json();
      document.getElementById('prod-price').textContent = money(j.amount, j.currency);
      document.getElementById('promo-status').textContent = j.discount > 0 ? `Promo applied: -${money(j.discount, j.currency)}` : '';
    }
  });
}

start();
