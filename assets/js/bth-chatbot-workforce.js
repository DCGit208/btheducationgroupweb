/**
 * BTH Workforce Infrastructure — scoped page assistant
 * Loads locale KB from assets/data/chatbot/workforce.{locale}.json
 */
(function () {
  'use strict';

  var KB_URL =
    (document.body && document.body.getAttribute('data-chat-kb')) ||
    'assets/data/chatbot/workforce.fr.json';

  var kb = null;
  var ctx = { messageCount: 0, maxSuggestions: 8 };
  var DOM = {};

  function escapeReg(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function normalizeMsg(msg) {
    return msg
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  function getResponse(userMessage) {
    if (!kb) return { response: '', suggestions: [] };
    var msg = normalizeMsg(userMessage);

    for (var i = 0; i < kb.intents.length; i++) {
      var intent = kb.intents[i];
      for (var j = 0; j < intent.keywords.length; j++) {
        var kw = intent.keywords[j];
        var normKw = normalizeMsg(kw);
        var pattern =
          normKw.length <= 4
            ? new RegExp('\\b' + escapeReg(normKw) + '\\b', 'i')
            : new RegExp(escapeReg(normKw), 'i');
        if (pattern.test(msg)) {
          return {
            response: intent.response,
            suggestions: intent.suggestions || []
          };
        }
      }
    }

    return {
      response: kb.fallback.response,
      suggestions: kb.fallback.suggestions || []
    };
  }

  function smoothScroll() {
    setTimeout(function () {
      DOM.messages.scrollTo({ top: DOM.messages.scrollHeight, behavior: 'smooth' });
    }, 80);
  }

  function addMessage(html, isUser) {
    var wrap = document.createElement('div');
    wrap.style.cssText = isUser
      ? 'background:linear-gradient(135deg,#054ada,#0f2060);padding:0.9rem 1rem;border-radius:0.75rem;animation:bthWfChatIn 0.3s ease;'
      : 'background:rgba(255,255,255,0.06);border-left:3px solid #0ea5e9;padding:0.9rem 1rem;border-radius:0.75rem;animation:bthWfChatIn 0.3s ease;';
    var p = document.createElement('p');
    p.style.cssText =
      'color:white;font-size:0.92rem;line-height:1.65;margin:0;white-space:pre-line;';
    p.innerHTML = html;
    wrap.appendChild(p);
    DOM.messages.appendChild(wrap);
    smoothScroll();
    return wrap;
  }

  function showTyping() {
    var label = (kb && kb.ui && kb.ui.typing) || '…';
    var d = document.createElement('div');
    d.id = 'bth-wf-typing';
    d.style.cssText =
      'background:rgba(255,255,255,0.06);border-left:3px solid #0ea5e9;padding:0.9rem 1rem;border-radius:0.75rem;display:flex;align-items:center;gap:0.5rem;';
    d.innerHTML =
      '<div style="display:flex;gap:4px;">' +
      '<span style="width:8px;height:8px;background:#0ea5e9;border-radius:50%;animation:bthWfDot 1.4s infinite 0s;"></span>' +
      '<span style="width:8px;height:8px;background:#0ea5e9;border-radius:50%;animation:bthWfDot 1.4s infinite 0.2s;"></span>' +
      '<span style="width:8px;height:8px;background:#0ea5e9;border-radius:50%;animation:bthWfDot 1.4s infinite 0.4s;"></span>' +
      '</div><span style="color:rgba(255,255,255,0.55);font-size:0.82rem;">' +
      label +
      '</span>';
    DOM.messages.appendChild(d);
    smoothScroll();
  }

  function removeTyping() {
    var t = document.getElementById('bth-wf-typing');
    if (t) t.remove();
  }

  function addSuggestions(suggestions, parentEl) {
    if (!suggestions || !suggestions.length) return;
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;flex-wrap:wrap;gap:0.4rem;margin-top:0.6rem;';
    suggestions.forEach(function (s) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = s;
      btn.style.cssText =
        'background:rgba(14,165,233,0.12);border:1px solid rgba(14,165,233,0.35);border-radius:999px;padding:0.35rem 0.75rem;color:rgba(255,255,255,0.9);font-size:0.78rem;cursor:pointer;font-family:inherit;';
      btn.onclick = function () {
        DOM.input.value = s;
        send();
      };
      row.appendChild(btn);
    });
    parentEl.appendChild(row);
  }

  function send() {
    var text = DOM.input.value.trim();
    if (!text) return;
    DOM.input.value = '';
    ctx.messageCount++;
    addMessage(text, true);
    showTyping();
    var delay = text.length > 60 ? 900 : 650;
    setTimeout(function () {
      removeTyping();
      var result = getResponse(text);
      var msgEl = addMessage(result.response, false);
      if (ctx.messageCount < ctx.maxSuggestions) {
        addSuggestions(result.suggestions, msgEl);
      }
    }, delay);
  }

  function openChat() {
    DOM.window.style.display = 'flex';
    DOM.window.setAttribute('aria-hidden', 'false');
    DOM.toggle.style.display = 'none';
    DOM.input.focus();
  }

  function closeChat() {
    DOM.window.style.display = 'none';
    DOM.window.setAttribute('aria-hidden', 'true');
    DOM.toggle.style.display = 'flex';
  }

  function injectStyles() {
    if (document.getElementById('bth-wf-chat-styles')) return;
    var style = document.createElement('style');
    style.id = 'bth-wf-chat-styles';
    style.textContent =
      '@keyframes bthWfChatIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}' +
      '@keyframes bthWfDot{0%,80%,100%{transform:scale(0.7);opacity:0.4}40%{transform:scale(1);opacity:1}}' +
      '@keyframes bthWfPulse{0%,100%{box-shadow:0 0 0 0 rgba(5,74,218,0.4)}70%{box-shadow:0 0 0 12px rgba(5,74,218,0)}}' +
      '#bth-wf-chat-toggle{animation:bthWfPulse 2.5s infinite}' +
      '#bth-wf-chat-messages::-webkit-scrollbar{width:5px}' +
      '#bth-wf-chat-messages::-webkit-scrollbar-thumb{background:rgba(14,165,233,0.45);border-radius:10px}' +
      '.bth-chat-link{color:#7dd3fc!important;text-decoration:underline}' +
      '.bth-chat-link:hover{color:#bae6fd!important}' +
      '@media(max-width:480px){#bth-wf-chat-window{width:calc(100vw - 1rem)!important;height:calc(100vh - 5rem)!important;right:0.5rem!important;bottom:1rem!important}}';
    document.head.appendChild(style);
  }

  function buildWidget() {
    if (!kb || !kb.ui) return;
    var ui = kb.ui;
    injectStyles();

    var toggle = document.createElement('button');
    toggle.id = 'bth-wf-chat-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', ui.toggleLabel || 'Assistant');
    toggle.style.cssText =
      'position:fixed;bottom:2rem;right:2rem;width:62px;height:62px;border-radius:50%;background:linear-gradient(135deg,#054ada,#0f2060);border:none;box-shadow:0 8px 24px rgba(5,74,218,0.4);cursor:pointer;z-index:9998;display:flex;align-items:center;justify-content:center;';
    toggle.innerHTML =
      '<svg width="27" height="27" fill="white" viewBox="0 0 20 20" aria-hidden="true"><path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z"/><path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z"/></svg>';

    var win = document.createElement('div');
    win.id = 'bth-wf-chat-window';
    win.setAttribute('aria-hidden', 'true');
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', ui.title || 'Assistant');
    win.style.cssText =
      'position:fixed;bottom:2rem;right:2rem;width:430px;max-width:calc(100vw - 1rem);height:640px;max-height:calc(100vh - 2.5rem);background:rgba(9,13,37,0.98);backdrop-filter:blur(20px);border-radius:1.5rem;border:1px solid rgba(255,255,255,0.1);box-shadow:0 20px 60px rgba(0,0,0,0.55);display:none;flex-direction:column;z-index:9999;overflow:hidden;font-family:Inter,system-ui,sans-serif;';

    var chipsHtml = '';
    (ui.chips || []).forEach(function (chip) {
      chipsHtml +=
        '<button type="button" class="bth-wf-qnav" data-q="' +
        escapeHtmlAttr(chip.q) +
        '">' +
        escapeHtml(chip.label || chip.q) +
        '</button>';
    });

    var bulletsHtml = '';
    (ui.welcomeBullets || []).forEach(function (b) {
      bulletsHtml +=
        '<div style="display:flex;gap:0.5rem;margin-top:0.35rem;">' +
        '<span style="color:#0ea5e9;">▸</span>' +
        '<span style="color:rgba(255,255,255,0.82);font-size:0.82rem;line-height:1.5;">' +
        b +
        '</span></div>';
    });

    win.innerHTML =
      '<div style="padding:1.25rem 1.5rem;background:linear-gradient(135deg,#054ada,#0f2060);display:flex;align-items:center;justify-content:space-between;flex-shrink:0;">' +
      '<div><h3 style="color:white;font-size:1.05rem;font-weight:700;margin:0;">' +
      escapeHtml(ui.title) +
      '</h3><p style="color:rgba(255,255,255,0.78);font-size:0.75rem;margin:0.2rem 0 0;">' +
      escapeHtml(ui.subtitle || '') +
      '</p></div>' +
      '<button type="button" id="bth-wf-chat-close" aria-label="Fermer" style="background:rgba(255,255,255,0.15);border:none;color:white;width:30px;height:30px;border-radius:0.5rem;cursor:pointer;">✕</button>' +
      '</div>' +
      '<div style="padding:0.75rem 1rem;border-bottom:1px solid rgba(255,255,255,0.07);display:flex;flex-wrap:wrap;gap:0.4rem;flex-shrink:0;">' +
      chipsHtml +
      '</div>' +
      '<div id="bth-wf-chat-messages" style="flex:1;padding:1rem;overflow-y:auto;display:flex;flex-direction:column;gap:1rem;">' +
      '<div style="background:rgba(14,165,233,0.1);border-left:3px solid #0ea5e9;padding:1rem;border-radius:0.75rem;">' +
      '<p style="color:white;font-size:0.9rem;line-height:1.65;margin:0 0 0.5rem;white-space:pre-line;">' +
      ui.welcome +
      '</p>' +
      bulletsHtml +
      '</div></div>' +
      '<div style="padding:0.85rem 1rem;border-top:1px solid rgba(255,255,255,0.08);flex-shrink:0;">' +
      '<div style="display:flex;gap:0.6rem;">' +
      '<input type="text" id="bth-wf-chat-input" autocomplete="off" placeholder="' +
      escapeHtmlAttr(ui.placeholder || '') +
      '" style="flex:1;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:0.65rem;padding:0.75rem 0.9rem;color:white;font-size:0.88rem;outline:none;font-family:inherit;"/>' +
      '<button type="button" id="bth-wf-chat-send" style="background:linear-gradient(135deg,#054ada,#0f2060);border:none;border-radius:0.65rem;padding:0.75rem 1.1rem;color:white;font-weight:600;font-size:0.85rem;cursor:pointer;">' +
      escapeHtml(ui.send || 'Send') +
      '</button></div>' +
      '<p style="color:rgba(255,255,255,0.3);font-size:0.68rem;margin:0.4rem 0 0;text-align:center;">' +
      escapeHtml(ui.footer || '') +
      '</p></div>';

    document.body.appendChild(toggle);
    document.body.appendChild(win);

    DOM.toggle = toggle;
    DOM.window = win;
    DOM.messages = win.querySelector('#bth-wf-chat-messages');
    DOM.input = win.querySelector('#bth-wf-chat-input');

    toggle.addEventListener('click', openChat);
    win.querySelector('#bth-wf-chat-close').addEventListener('click', closeChat);
    win.querySelector('#bth-wf-chat-send').addEventListener('click', send);
    DOM.input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') send();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && win.style.display === 'flex') closeChat();
    });

    win.querySelectorAll('.bth-wf-qnav').forEach(function (btn) {
      btn.style.cssText =
        'background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:999px;padding:0.28rem 0.7rem;color:rgba(255,255,255,0.85);font-size:0.73rem;cursor:pointer;font-family:inherit;';
      btn.addEventListener('click', function () {
        DOM.input.value = btn.getAttribute('data-q') || '';
        send();
      });
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeHtmlAttr(str) {
    return escapeHtml(str).replace(/'/g, '&#39;');
  }

  function loadKb() {
    return fetch(KB_URL)
      .then(function (res) {
        if (!res.ok) throw new Error('KB fetch ' + res.status);
        return res.json();
      })
      .then(function (data) {
        kb = data;
        buildWidget();
      })
      .catch(function (err) {
        console.warn('[bth-chatbot-workforce]', err);
      });
  }

  function init() {
    var lang = (document.documentElement.lang || 'fr').toLowerCase().slice(0, 2);
    if (!document.body.getAttribute('data-chat-kb')) {
      KB_URL = 'assets/data/chatbot/workforce.' + lang + '.json';
    }
    loadKb();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
