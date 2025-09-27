// frontend/assets/js/payment.js
// Handles payment flow with Stripe + BTH backend

let stripe, elements;
const backend = window.BTH_BACKEND || "http://localhost:5000";

async function init() {
  const urlParams = new URLSearchParams(window.location.search);
  const sku = urlParams.get("sku");
  if (!sku) {
    document.getElementById("program-info").innerText =
      "⚠️ Missing SKU in URL. Example: payment.html?sku=oedp-cyber-bootcamp";
    return;
  }

  // 1. Get publishable key
  const cfgRes = await fetch(`${backend}/config`);
  const { publishableKey } = await cfgRes.json();
  stripe = Stripe(publishableKey);

  // 2. Load program info
  const catRes = await fetch(`${backend}/catalog?sku=${sku}`);
  const cat = await catRes.json();

  if (cat.error) {
    document.getElementById("program-info").innerText = "⚠️ " + cat.error;
    return;
  }

  document.getElementById("program-info").innerHTML = `
    <h2>${cat.name}</h2>
    <p>${cat.description || ""}</p>
    <p><strong>Price:</strong> ${(cat.amount / 100).toFixed(2)} ${cat.currency.toUpperCase()}</p>
  `;

  // 3. Setup Stripe Elements
  elements = stripe.elements();
  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");

  const form = document.getElementById("payment-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const promo = document.getElementById("promo").value;

    // 4. Create PaymentIntent
    const piRes = await fetch(`${backend}/create-payment-intent`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sku, email, promo })
    });
    const pi = await piRes.json();

    if (pi.error) {
      document.getElementById("error-message").innerText = pi.error;
      return;
    }

    // 5. Confirm payment
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: pi.clientSecret,
      confirmParams: {
        return_url: window.location.origin + "/frontend/success.html",
        receipt_email: email
      }
    });

    if (error) {
      document.getElementById("error-message").innerText = error.message;
    } else {
      // Payment successful — will redirect
      document.getElementById("payment-success").style.display = "block";
      form.style.display = "none";
    }
  });
}

init();