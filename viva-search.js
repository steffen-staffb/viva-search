(function () {
  var VIVA_LABEL = 'Viva Engage';

  // Zufallszahl zwischen 5 und 10 – einmal festlegen, dann konsistent halten
  var VIVA_COUNT = Math.floor(Math.random() * (10 - 5 + 1)) + 5;

  // Style: Zähler des Fake-Eintrags dauerhaft in dunklem Grau anzeigen
  // (wie bei den Standard-Kategorien, statt Weiß wie beim aktiven Eintrag)
  if (!document.getElementById('fake-viva-style')) {
    var styleEl = document.createElement('style');
    styleEl.id = 'fake-viva-style';
    styleEl.textContent =
      'li[data-fake-viva="1"] button.category-button::after{ color: oklch(0.5103 0 0) !important; }';
    document.head.appendChild(styleEl);
  }

  function injectViva() {
    // Vorhandenen Microsoft-365-Eintrag finden (dient als Vorlage)
    var m365Btn = Array.prototype.slice
      .call(document.querySelectorAll('button.category-button'))
      .find(function (b) { return b.querySelector('img[alt="Microsoft 365"]'); });
    if (!m365Btn) return;

    var li = m365Btn.closest('li');
    if (!li || !li.parentElement) return;
    if (li.parentElement.querySelector('li[data-fake-viva="1"]')) return; // Duplikate vermeiden

    // Eintrag klonen (übernimmt automatisch das Original-Microsoft-Icon)
    var clone = li.cloneNode(true);
    clone.setAttribute('data-fake-viva', '1');

    var btn = clone.querySelector('button.category-button');
    if (!btn) return;

    // Label ersetzen
    [btn, btn.querySelector('.ds-button__content')].filter(Boolean).forEach(function (c) {
      Array.prototype.slice.call(c.childNodes).forEach(function (n) {
        if (n.nodeType === 3 && n.textContent.trim()) n.textContent = ' ' + VIVA_LABEL;
      });
    });

    // Nur den Alt-Text anpassen – das Microsoft-Icon (src) bleibt erhalten
    var img = btn.querySelector('img');
    if (img) img.setAttribute('alt', VIVA_LABEL);

    // Zähler setzen
    btn.setAttribute('data-count', String(VIVA_COUNT));

    // Als inaktive Kategorie darstellen (nicht als aktive/primäre)
    btn.classList.remove('ds-button--solid', 'ds-button--primary');
    btn.classList.add('ds-button--ghost', 'ds-button--neutral');

    // Weiße Zähler-Schriftfarbe entfernen, damit die Zahl auf hellem Grund sichtbar ist
    Array.prototype.slice.call(btn.classList)
      .filter(function (c) { return c.indexOf('after:text') !== -1; })
      .forEach(function (c) { btn.classList.remove(c); });

    // Direkt nach dem Microsoft-365-Eintrag einfügen
    li.parentElement.insertBefore(clone, li.nextSibling);
  }

  injectViva();

  // Bei Neu-Rendern der Suche erneut einfügen
  new MutationObserver(function () { injectViva(); })
    .observe(document.body, { childList: true, subtree: true });
})();
