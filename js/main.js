/* Sua Marca: comportamentos progressivos. A página funciona sem este arquivo. */
(function () {
  'use strict';
  var mobile = window.matchMedia('(max-width: 59.99em)');

  function initMenu() {
    var btn = document.querySelector('.menu-btn');
    var menu = document.getElementById('menu');
    if (!btn || !menu) return;
    function close() { menu.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
    function open() { menu.hidden = false; btn.setAttribute('aria-expanded', 'true'); }
    function sync() { if (mobile.matches) { close(); } else { menu.hidden = false; btn.setAttribute('aria-expanded', 'false'); } }
    btn.addEventListener('click', function () { if (menu.hidden) { open(); } else { close(); } });
    menu.addEventListener('click', function (e) { if (e.target.closest('a') && mobile.matches) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobile.matches && !menu.hidden) { close(); btn.focus(); }
    });
    if (mobile.addEventListener) mobile.addEventListener('change', sync);
    sync();
  }

  function initForm() {
    var form = document.getElementById('quote-form');
    var status = document.getElementById('form-status');
    if (!form || !status) return;
    var msg = {
      required: 'Campo obrigatório',
      contact: 'Informe um telefone ou email válido',
      success: 'Pedido enviado. Retornamos em breve.',
      error: 'Confira os campos destacados.'
    };
    function isContact(v) {
      var d = v.replace(/\D/g, '');
      return (d.length >= 10 && d.length <= 13) || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }
    function setError(field, text) {
      var wrap = field.closest('.field');
      var id = field.id + '-error';
      var el = document.getElementById(id);
      if (!wrap) return;
      if (!text) {
        wrap.classList.remove('is-invalid');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
        if (el) el.remove();
        return;
      }
      if (!el) { el = document.createElement('p'); el.className = 'field__error'; el.id = id; wrap.appendChild(el); }
      el.textContent = text;
      wrap.classList.add('is-invalid');
      field.setAttribute('aria-invalid', 'true');
      field.setAttribute('aria-describedby', id);
    }
    function validate(field) {
      var v = field.value.trim();
      if (!v) { setError(field, msg.required); return false; }
      if (field.id === 'contato' && !isContact(v)) { setError(field, msg.contact); return false; }
      setError(field, '');
      return true;
    }
    var fields = Array.prototype.slice.call(form.querySelectorAll('input, textarea'));
    fields.forEach(function (f) {
      f.addEventListener('blur', function () { validate(f); });
      f.addEventListener('input', function () { if (f.getAttribute('aria-invalid') === 'true') validate(f); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var first = null;
      fields.forEach(function (f) { if (!validate(f) && !first) first = f; });
      status.className = 'form__status';
      if (first) { status.classList.add('is-error'); status.textContent = msg.error; first.focus(); return; }
      /* Sem backend no demo: mensagem de sucesso estática. */
      status.classList.add('is-success');
      status.textContent = msg.success;
      form.reset();
    });
  }

  function initYear() {
    var y = document.getElementById('year');
    if (y) y.textContent = String(new Date().getFullYear());
  }


  /* Transições ao rolar: alegres, com quique; só com JS, nada em reduced motion */
  function initReveal() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js');
    var groups = [
      ['.hero .kicker', 'rv-down'], ['.hero h1, .hero__lead, .hero__text .btn', 'rv-up'],
      ['.hero__media img', 'rv-pop'], ['.blob', 'rv-bloom'],
      ['.section-head', 'rv-up'], ['.gallery__item', 'rv-pop'],
      ['.spaces__list li', 'rv-left'], ['.about__text', 'rv-left'], ['.about__media', 'rv-right'],
      ['.unit', 'rv-up'], ['.units__map', 'rv-pop'], ['.quote h2, .quote p', 'rv-up'], ['.form', 'rv-pop']
    ];
    groups.forEach(function (g) {
      var items = document.querySelectorAll(g[0]);
      for (var i = 0; i < items.length; i++) {
        items[i].classList.add('reveal', g[1]);
        items[i].style.transitionDelay = Math.min(i, 5) * 110 + 'ms';
      }
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
    var nodes = document.querySelectorAll('.reveal');
    for (var n = 0; n < nodes.length; n++) observer.observe(nodes[n]);
  }

  initMenu();
  initForm();
  initYear();
  initReveal();
})();
