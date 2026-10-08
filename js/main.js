/* Interações da página: dados de contato, menu mobile, animação de entrada e ano. */
(function () {
  'use strict';

  /* ============================================================
     DADOS DA POUSADA — edite SÓ aqui. A página se preenche sozinha.
     Deixe o valor vazio ('') que o item some do site até você preencher.
     WhatsApp: só dígitos no formato 55 + DDD + número (ex.: 5511999998888).
     ============================================================ */
  var CONFIG = {
    whatsapp: '',                 // ex.: '5511999998888'
    whatsappMsg: 'Olá! Gostaria de informações e disponibilidade na Pousada Santa Helena.',
    telefone: '',                 // ex.: '(11) 4035-0000'
    email: '',                    // ex.: 'contato@pousadasantahelena.com.br'
    instagram: 'pousadasantahelenaa', // perfil oficial (sem @)
  };

  function waLink() {
    if (!CONFIG.whatsapp) return '';
    var base = 'https://wa.me/' + CONFIG.whatsapp;
    return CONFIG.whatsappMsg ? base + '?text=' + encodeURIComponent(CONFIG.whatsappMsg) : base;
  }

  // Revela o <li data-contact="..."> correspondente (estava hidden).
  function showContact(key) {
    var li = document.querySelector('[data-contact="' + key + '"]');
    if (li) li.hidden = false;
  }

  // --- WhatsApp (botões + item de contato) ---
  var wa = waLink();
  if (wa) {
    document.querySelectorAll('[data-wa]').forEach(function (el) {
      el.setAttribute('href', wa);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
    });
    showContact('wa');
  }

  // --- Telefone ---
  if (CONFIG.telefone) {
    var telText = document.querySelector('[data-tel-text]');
    if (telText) telText.textContent = CONFIG.telefone;
    var telLink = document.querySelector('[data-tel-link]');
    if (telLink) telLink.setAttribute('href', 'tel:' + CONFIG.telefone.replace(/[^0-9+]/g, ''));
    showContact('tel');
  }

  // --- E-mail ---
  if (CONFIG.email) {
    var mail = document.querySelector('[data-email]');
    if (mail) { mail.setAttribute('href', 'mailto:' + CONFIG.email); mail.textContent = CONFIG.email; }
    showContact('email');
  }

  // --- Instagram ---
  if (CONFIG.instagram) {
    document.querySelectorAll('[data-ig]').forEach(function (el) {
      el.setAttribute('href', 'https://www.instagram.com/' + CONFIG.instagram + '/');
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener');
      el.hidden = false;
      if (el.hasAttribute('data-ig-text')) el.textContent = 'Siga no Instagram @' + CONFIG.instagram;
    });
  }

  // --- Menu mobile ---
  var btn = document.getElementById('menu-btn');
  var menu = document.getElementById('menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        menu.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Abrir menu');
      }
    });
  }

  // --- Revelar seções ao rolar ---
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    items.forEach(function (el) { observer.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('visible'); });
  }

  // --- Ano atual no rodapé ---
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
