(function () {
  var VIVA_LABEL = 'Viva Engage';
  var ICON = 'https://files.staffbase.com/icons/search/microsoft.svg';
  var VIVA_COUNT = Math.floor(Math.random() * (10 - 5 + 1)) + 5; // Zahl 5..10

  // Pool mit bis zu 10 Beispiel-Inhalten (frei anpassbar)
  var POSTS = [
    { author:'Desk User', date:'Jun 11, 2025', text:'Hello everyone! Summer is here – and with it the perfect opportunity to lace up your running shoes and rack up some miles together!' },
    { author:'Desk User', date:'Jun 4, 2024', text:'Hi everyone! Excited to be a part of this community.' },
    { author:'All Company', date:'May 2, 2025', text:'This is the default group for everyone in the network. Share thoughts, ideas, or updates with the whole company.' },
    { author:'HR Team', date:'Apr 18, 2025', text:'Reminder: Our quarterly town hall takes place next Friday at 2 PM. Bring your questions!' },
    { author:'IT Support', date:'Apr 3, 2025', text:'Planned maintenance this weekend. Please save your work before Saturday 8 PM.' },
    { author:'Marketing', date:'Mar 21, 2025', text:'Our new brand guidelines are live. Check the Files tab for the updated logo package.' },
    { author:'Jane Doe', date:'Mar 9, 2025', text:'Big thanks to the events team for an amazing offsite last week. Great memories!' },
    { author:'Facilities', date:'Feb 26, 2025', text:'The new coffee machines have arrived on every floor. Enjoy!' },
    { author:'Leadership', date:'Feb 12, 2025', text:'Proud to share that we hit our sustainability goals a full quarter early. Thank you all!' },
    { author:'Onboarding', date:'Jan 30, 2025', text:'Welcome to all our new joiners this month! Introduce yourself in the comments.' }
  ];

  function esc(s){ return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
  function initials(n){ return n.split(/\s+/).map(function(w){return w[0];}).join('').slice(0,2).toUpperCase(); }

  // Styles: Zähler immer sichtbar (grau; aktiv weiß) + Lade-Spinner ausblenden
  // WICHTIG: Der Spinner-Wrapper (div.absolute) hängt am LI, nicht am Button!
  if(!document.getElementById('fake-viva-style')){
    var st=document.createElement('style'); st.id='fake-viva-style';
    st.textContent=
      'li[data-fake-viva="1"] button.category-button::after{color:oklch(0.5103 0 0)!important;}'+
      'li[data-fake-viva="1"][data-active="1"] button.category-button::after{color:var(--sb-color-white)!important;}'+
      'li[data-fake-viva="1"] .ds-loading-spinner{display:none!important;}'+
      'li[data-fake-viva="1"] > div.absolute{display:none!important;}';
    document.head.appendChild(st);
  }

  // Zusätzlich proaktiv entfernen (Sicherheitsnetz)
  function stripSpinner(){
    document.querySelectorAll('li[data-fake-viva="1"] > div.absolute').forEach(function(w){
      if(w.querySelector('.ds-loading-spinner') || w.querySelector('svg')) w.remove();
    });
    document.querySelectorAll('li[data-fake-viva="1"] .ds-loading-spinner').forEach(function(s){ s.remove(); });
  }

  function nativeResults(){ return Array.prototype.slice.call(document.querySelectorAll('.search__results')).find(function(x){return !x.closest('#viva-view');}); }
  function getWrapper(){ var n=nativeResults(); return n?n.parentElement:null; }
  function nativeResultsClass(){ var n=nativeResults(); return n? n.className : 'search__results gap-8 p-4 flex max-w-[1156px] flex-col'; }
  function nativeHeaderRowClass(){ var w=getWrapper(); if(!w) return 'h-10 flex items-center'; var h=Array.prototype.slice.call(w.children).find(function(c){return c.querySelector&&c.querySelector('hgroup');}); return h?h.className:'h-10 flex items-center'; }

  function showVivaView(){
    var wrapper=getWrapper(); if(!wrapper) return; if(document.getElementById('viva-view')) return;
    var rc=nativeResultsClass(), hrc=nativeHeaderRowClass();
    Array.prototype.slice.call(wrapper.children).forEach(function(c){ c.dataset.vivaHidden='1'; c.style.display='none'; });
    var view=document.createElement('div'); view.id='viva-view';
    var header=document.createElement('div'); header.className=hrc;
    header.innerHTML='<hgroup class="gap-3 px-4 flex items-baseline"><img class="object-cover object-center" style="width:18px;height:18px" src="'+ICON+'" alt="'+VIVA_LABEL+'"><h2 class="text-lg font-semibold text-(--sb-color-grey-800)">'+VIVA_LABEL+'</h2></hgroup>';
    var resultsDiv=document.createElement('div'); resultsDiv.className=rc;
    var ul=document.createElement('ul'); ul.className='flex flex-col';
    POSTS.slice(0, Math.min(VIVA_COUNT, POSTS.length)).forEach(function(p){
      var li=document.createElement('li');
      li.innerHTML='<article class="group gap-4 bg-neutral-surface relative flex w-full max-w-[816px] rounded-(--border-radius-root)">'+
        '<a class="gap-3 p-4 flex w-full" href="https://engage.cloud.microsoft" target="_blank" rel="noopener">'+
          '<div class="!h-[60px] min-h-[60px] !w-[60px] flex items-center justify-center rounded-(--border-radius-root)" style="background:#2266E3;color:#fff;font-weight:600;font-size:18px;">'+esc(initials(p.author))+'</div>'+
          '<div class="result meta min-w-0 gap-1 text-body-sm flex flex-col">'+
            '<h3 class="text-title-md text-neutral-strong truncate">'+esc(p.text.slice(0,70))+(p.text.length>70?'…':'')+'</h3>'+
            '<div class="gap-1 text-sm leading-18"><ol class="min-w-0 gap-1 flex"><li class="gap-1 flex"><span class="text-primary-vivid truncate">Viva Engage</span></li><li class="gap-1 flex"><span class="truncate">'+esc(p.author)+'</span></li><li class="gap-1 flex"><span class="truncate">'+esc(p.date)+'</span></li></ol></div>'+
          '</div></a></article>';
      ul.appendChild(li);
    });
    resultsDiv.appendChild(ul); view.appendChild(header); view.appendChild(resultsDiv); wrapper.appendChild(view);
  }
  function hideVivaView(){ var w=getWrapper(); if(!w) return; var v=document.getElementById('viva-view'); if(v) v.remove(); Array.prototype.slice.call(w.children).forEach(function(c){ if(c.dataset.vivaHidden){ c.style.display=''; delete c.dataset.vivaHidden; }}); }
  function deHighlightActive(){ Array.prototype.slice.call(document.querySelectorAll('button.category-button.ds-button--primary')).filter(function(b){return !b.closest('li[data-fake-viva]');}).forEach(function(b){ b.setAttribute('data-viva-deactivated','1'); b.classList.remove('ds-button--solid','ds-button--primary'); b.classList.add('ds-button--ghost','ds-button--neutral'); }); }
  function restoreHighlight(){ document.querySelectorAll('button.category-button[data-viva-deactivated]').forEach(function(b){ b.removeAttribute('data-viva-deactivated'); b.classList.remove('ds-button--ghost','ds-button--neutral'); b.classList.add('ds-button--solid','ds-button--primary'); }); }
  function setVivaActive(a){ var li=document.querySelector('li[data-fake-viva="1"]'); if(!li) return; var btn=li.querySelector('button.category-button'); if(a){ li.setAttribute('data-active','1'); btn.classList.remove('ds-button--ghost','ds-button--neutral'); btn.classList.add('ds-button--solid','ds-button--primary'); } else { li.removeAttribute('data-active'); btn.classList.remove('ds-button--solid','ds-button--primary'); btn.classList.add('ds-button--ghost','ds-button--neutral'); } }
  function activateViva(){ deHighlightActive(); showVivaView(); setVivaActive(true); }
  function deactivateViva(){ hideVivaView(); setVivaActive(false); restoreHighlight(); }

  function injectViva(){
    var m365Btn=Array.prototype.slice.call(document.querySelectorAll('button.category-button')).find(function(b){return b.querySelector('img[alt="Microsoft 365"]');});
    if(!m365Btn) return; var li=m365Btn.closest('li'); if(!li||!li.parentElement) return;
    if(li.parentElement.querySelector('li[data-fake-viva="1"]')) return;
    var clone=li.cloneNode(true); clone.setAttribute('data-fake-viva','1');
    var btn=clone.querySelector('button.category-button'); if(!btn) return;

    [btn, btn.querySelector('.ds-button__content')].filter(Boolean).forEach(function(c){ Array.prototype.slice.call(c.childNodes).forEach(function(n){ if(n.nodeType===3&&n.textContent.trim()) n.textContent=' '+VIVA_LABEL; }); });
    var img=btn.querySelector('img'); if(img) img.setAttribute('alt',VIVA_LABEL);
    btn.setAttribute('data-count',String(VIVA_COUNT));

    // Zustands-Attribute/IDs entfernen, die Spinner/Schloss auslösen
    ['aria-busy','aria-pressed','aria-disabled','disabled','data-loading','data-busy','data-c13y-id','data-c13y-component'].forEach(function(a){ btn.removeAttribute(a); });
    ['data-c13y-id','data-c13y-component'].forEach(function(a){ clone.removeAttribute(a); });
    // vorhandene Spinner im Klon entfernen (Wrapper hängt am LI!)
    Array.prototype.slice.call(clone.querySelectorAll('.ds-loading-spinner')).forEach(function(s){ (s.closest('div.absolute')||s).remove(); });

    btn.classList.remove('ds-button--solid','ds-button--primary'); btn.classList.add('ds-button--ghost','ds-button--neutral');
    Array.prototype.slice.call(btn.classList).filter(function(c){return c.indexOf('after:text')!==-1;}).forEach(function(c){btn.classList.remove(c);});
    btn.classList.remove('!cursor-default'); btn.style.cursor='pointer';

    btn.addEventListener('click', function(e){ e.preventDefault(); e.stopPropagation(); activateViva(); });
    li.parentElement.insertBefore(clone, li.nextSibling);
    stripSpinner();
    document.querySelectorAll('button.category-button').forEach(function(rb){ if(rb.closest('li[data-fake-viva]')||rb.dataset.vivaBound) return; rb.dataset.vivaBound='1'; rb.addEventListener('click', function(){ deactivateViva(); }); });
  }

  injectViva();
  new MutationObserver(function(){ injectViva(); stripSpinner(); }).observe(document.body,{childList:true,subtree:true});
})();
