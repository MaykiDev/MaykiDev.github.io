/* ==========================================================================
   IFCT Contabilidade — scripts
   Sem dependências. Cada bloco é independente e só roda se o elemento existir.
   ========================================================================== */
document.documentElement.classList.add('js');

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const WHATSAPP = '5566992044975';

/* ---------- Cabeçalho: sombra ao rolar ---------- */
(() => {
  const header = $('[data-header]');
  if (!header) return;
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ---------- Segmentos: carrossel infinito ---------- */
(() => {
  const marquee = $('[data-marquee]');
  if (!marquee) return;
  const track = $('.segments__track', marquee);
  const list = $('ul', track);
  // Em telas largas, repete os itens até a lista cobrir a faixa inteira (senão sobra um vão no loop)
  const items = $$('li', list);
  while (list.offsetWidth < marquee.offsetWidth) {
    items.forEach(li => {
      const copy = li.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      list.append(copy);
    });
  }
  // Cópia idêntica logo após a original: em -50% a faixa volta ao início sem salto
  const clone = list.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.append(clone);
  // Velocidade constante (~40px/s), qualquer que seja a quantidade de segmentos
  track.style.setProperty('--marquee-dur', `${Math.round(list.offsetWidth / 40)}s`);
})();

/* ---------- Menu mobile ---------- */
(() => {
  const burger = $('[data-burger]');
  const menu = $('[data-menu]');
  if (!burger || !menu) return;

  const toggle = (open) => {
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    menu.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };

  burger.addEventListener('click', () => toggle(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', menu).forEach(a => a.addEventListener('click', () => toggle(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  matchMedia('(min-width: 64em)').addEventListener('change', e => e.matches && toggle(false));
})();

/* ---------- Link ativo no menu conforme a seção visível ---------- */
(() => {
  const links = $$('.nav__menu ul a');
  const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(l => l.classList.remove('is-current'));
      map.get(en.target.id)?.classList.add('is-current');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
})();

/* ---------- Foto da sede: fundo elegante se a imagem não carregar ---------- */
(() => {
  const fig = $('.story__media');
  const img = fig && $('img', fig);
  if (!img) return;
  const fail = () => fig.classList.add('no-img');
  if (img.complete && !img.naturalWidth) fail();
  img.addEventListener('error', fail);
})();

/* ---------- Mês atual no painel do hero + ano no rodapé ---------- */
(() => {
  const now = new Date();
  const month = now.toLocaleDateString('pt-BR', { month: 'long' });
  const m = $('[data-month]');
  if (m) m.textContent = month.charAt(0).toUpperCase() + month.slice(1);
  // Último dia do mês para a estimativa de IRPJ/CSLL
  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const lastEl = $('.day--o');
  if (lastEl) lastEl.textContent = last;
  const y = $('[data-year]');
  if (y) y.textContent = now.getFullYear();
})();

/* ---------- Animação de entrada + contador dos números ---------- */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = $$('.reveal');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(el => el.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  // pequeno atraso em cascata para itens irmãos
  items.forEach((el, i) => {
    const siblings = el.parentElement ? $$(':scope > .reveal', el.parentElement) : [];
    const idx = siblings.indexOf(el);
    if (idx > 0) el.style.transitionDelay = `${Math.min(idx, 5) * 70}ms`;
    io.observe(el);
  });

  // Contadores
  const fmt = n => n.toLocaleString('pt-BR');
  const counters = $$('[data-count]');
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target;
      const end = +el.dataset.count;
      const t0 = performance.now();
      const dur = 1200;
      const tick = t => {
        const p = Math.min((t - t0) / dur, 1);
        el.textContent = fmt(Math.round(end * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: .6 });
  counters.forEach(c => cio.observe(c));
})();

/* ==========================================================================
   CONSULTA DE CFOP
   Cada operação tem o código para: [estadual, interestadual, exterior].
   null = não se aplica àquele destino.
   ========================================================================== */
const CFOP = {
  saida: [
    { id: 'venda-revenda', label: 'Venda de mercadoria comprada para revenda', desc: 'Venda de mercadoria adquirida ou recebida de terceiros', codes: ['5102', '6102', '7102'] },
    { id: 'venda-producao', label: 'Venda de produto fabricado pela empresa', desc: 'Venda de produção do estabelecimento', codes: ['5101', '6101', '7101'] },
    { id: 'venda-cf-revenda', label: 'Venda de revenda para consumidor final (pessoa física / não contribuinte)', desc: 'Venda de mercadoria de terceiros destinada a não contribuinte', codes: ['5102', '6108', '7102'], hint: { 1: 'Em outro estado, a venda para não contribuinte usa 6108 e envolve o DIFAL.' } },
    { id: 'venda-cf-producao', label: 'Venda de produção para consumidor final (não contribuinte)', desc: 'Venda de produção do estabelecimento destinada a não contribuinte', codes: ['5101', '6107', '7101'], hint: { 1: 'Em outro estado, a venda para não contribuinte usa 6107 e envolve o DIFAL.' } },
    { id: 'venda-st', label: 'Venda de mercadoria com ICMS-ST já retido', desc: 'Venda de mercadoria sujeita à substituição tributária, com imposto retido anteriormente', codes: ['5405', '6404', null], hint: { 0: '5405 vale quando a sua empresa é a substituída (o ICMS-ST foi pago na compra).' } },
    { id: 'dev-compra-com', label: 'Devolução de compra para revenda', desc: 'Devolução de compra para comercialização', codes: ['5202', '6202', '7202'] },
    { id: 'dev-compra-ind', label: 'Devolução de compra de matéria-prima / insumo', desc: 'Devolução de compra para industrialização', codes: ['5201', '6201', '7201'] },
    { id: 'transf-revenda', label: 'Transferência de mercadoria entre filiais', desc: 'Transferência de mercadoria adquirida ou recebida de terceiros', codes: ['5152', '6152', null] },
    { id: 'transf-producao', label: 'Transferência de produção entre filiais', desc: 'Transferência de produção do estabelecimento', codes: ['5151', '6151', null] },
    { id: 'bonificacao', label: 'Bonificação, doação ou brinde', desc: 'Remessa em bonificação, doação ou brinde', codes: ['5910', '6910', null] },
    { id: 'amostra', label: 'Amostra grátis', desc: 'Remessa de amostra grátis', codes: ['5911', '6911', null] },
    { id: 'demonstracao', label: 'Remessa para demonstração', desc: 'Remessa de mercadoria ou bem para demonstração', codes: ['5912', '6912', null] },
    { id: 'conserto', label: 'Envio para conserto ou reparo', desc: 'Remessa de mercadoria ou bem para conserto ou reparo', codes: ['5915', '6915', null] },
    { id: 'ret-conserto', label: 'Devolver ao cliente um bem que veio para conserto', desc: 'Retorno de mercadoria ou bem recebido para conserto ou reparo', codes: ['5916', '6916', null] },
    { id: 'industrializacao', label: 'Remessa para industrialização por encomenda', desc: 'Remessa para industrialização por encomenda', codes: ['5901', '6901', null] },
    { id: 'imobilizado', label: 'Venda de bem do ativo imobilizado (máquina, veículo…)', desc: 'Venda de bem do ativo imobilizado', codes: ['5551', '6551', '7551'] },
    { id: 'outras-s', label: 'Outra saída não listada', desc: 'Outra saída de mercadoria ou prestação de serviço não especificada', codes: ['5949', '6949', '7949'], hint: { all: 'Use só quando nenhum outro código se encaixa. Vale confirmar com a contabilidade.' } },
  ],
  entrada: [
    { id: 'compra-com', label: 'Compra de mercadoria para revenda', desc: 'Compra para comercialização', codes: ['1102', '2102', '3102'] },
    { id: 'compra-ind', label: 'Compra de matéria-prima / insumo para produção', desc: 'Compra para industrialização', codes: ['1101', '2101', '3101'] },
    { id: 'compra-st', label: 'Compra para revenda com ICMS-ST', desc: 'Compra para comercialização de mercadoria sujeita à substituição tributária', codes: ['1403', '2403', null] },
    { id: 'uso-consumo', label: 'Compra de material de uso e consumo', desc: 'Compra de material para uso ou consumo', codes: ['1556', '2556', '3556'] },
    { id: 'ativo', label: 'Compra para o ativo imobilizado (máquina, veículo…)', desc: 'Compra de bem para o ativo imobilizado', codes: ['1551', '2551', '3551'] },
    { id: 'dev-venda-rev', label: 'Cliente devolveu mercadoria de revenda', desc: 'Devolução de venda de mercadoria adquirida ou recebida de terceiros', codes: ['1202', '2202', '3202'] },
    { id: 'dev-venda-prod', label: 'Cliente devolveu produto fabricado pela empresa', desc: 'Devolução de venda de produção do estabelecimento', codes: ['1201', '2201', '3201'] },
    { id: 'transf-com', label: 'Transferência recebida de filial (para revenda)', desc: 'Transferência para comercialização', codes: ['1152', '2152', null] },
    { id: 'transf-ind', label: 'Transferência recebida de filial (para produção)', desc: 'Transferência para industrialização', codes: ['1151', '2151', null] },
    { id: 'bonificacao-e', label: 'Recebimento de bonificação, doação ou brinde', desc: 'Entrada de bonificação, doação ou brinde', codes: ['1910', '2910', null] },
    { id: 'amostra-e', label: 'Recebimento de amostra grátis', desc: 'Entrada de amostra grátis', codes: ['1911', '2911', null] },
    { id: 'demonstracao-e', label: 'Recebimento para demonstração', desc: 'Entrada de mercadoria ou bem recebido para demonstração', codes: ['1912', '2912', null] },
    { id: 'conserto-e', label: 'Recebimento de bem de cliente para conserto', desc: 'Entrada de mercadoria ou bem recebido para conserto ou reparo', codes: ['1915', '2915', null] },
    { id: 'ret-conserto-e', label: 'Retorno de bem que enviamos para conserto', desc: 'Retorno de mercadoria ou bem remetido para conserto ou reparo', codes: ['1916', '2916', null] },
    { id: 'outras-e', label: 'Outra entrada não listada', desc: 'Outra entrada de mercadoria ou prestação de serviço não especificada', codes: ['1949', '2949', '3949'], hint: { all: 'Use só quando nenhum outro código se encaixa. Vale confirmar com a contabilidade.' } },
  ],
};
const LOCAIS = ['estadual', 'interestadual', 'exterior'];
const LOCAL_LABEL = { estadual: 'Mesmo estado', interestadual: 'Outro estado', exterior: 'Exterior' };

(() => {
  const tool = $('[data-tool]');
  if (!tool) return;

  const select = $('[data-operacao]', tool);
  const codeEl = $('[data-code]', tool);
  const descEl = $('[data-desc]', tool);
  const hintEl = $('[data-hint]', tool);
  const result = $('[data-result]', tool);
  const copyBtn = $('[data-copy]', tool);

  const get = name => $(`input[name="${name}"]:checked`, tool).value;

  const fillOptions = () => {
    const tipo = get('tipo');
    const keep = select.value;
    select.innerHTML = CFOP[tipo].map(o => `<option value="${o.id}">${o.label}</option>`).join('');
    if (CFOP[tipo].some(o => o.id === keep)) select.value = keep;
  };

  const render = () => {
    const tipo = get('tipo');
    const li = LOCAIS.indexOf(get('local'));
    const op = CFOP[tipo].find(o => o.id === select.value) || CFOP[tipo][0];
    const code = op.codes[li];

    if (code) {
      codeEl.textContent = code;
      codeEl.classList.remove('is-na');
      descEl.textContent = op.desc;
      copyBtn.hidden = false;
    } else {
      codeEl.textContent = 'Não se aplica';
      codeEl.classList.add('is-na');
      descEl.textContent = `Essa operação normalmente não acontece com o exterior. Em casos específicos, costuma-se usar ${tipo === 'saida' ? '7949' : '3949'} — confirme com a IFCT.`;
      copyBtn.hidden = true;
    }
    hintEl.textContent = code ? (op.hint?.[li] || op.hint?.all || '') : '';

    // Ajuda de leitura do código
    if (code && !hintEl.textContent) {
      hintEl.textContent = `Começa com ${code[0]}: ${tipo === 'saida' ? 'saída' : 'entrada'} · ${LOCAL_LABEL[LOCAIS[li]].toLowerCase()}.`;
    }

    result.classList.remove('flash');
    void result.offsetWidth; // reinicia a animação
    result.classList.add('flash');
    resetCopy();
  };

  // Copiar
  const label = $('span', copyBtn);
  const resetCopy = () => { copyBtn.classList.remove('is-done'); label.textContent = 'Copiar código'; };
  copyBtn.addEventListener('click', async () => {
    const text = codeEl.textContent;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement('textarea');
      t.value = text; document.body.append(t); t.select();
      try { document.execCommand('copy'); } catch {}
      t.remove();
    }
    copyBtn.classList.add('is-done');
    label.textContent = 'Copiado!';
    setTimeout(resetCopy, 1800);
  });

  $$('input[name="tipo"]', tool).forEach(i => i.addEventListener('change', () => { fillOptions(); render(); }));
  $$('input[name="local"]', tool).forEach(i => i.addEventListener('change', render));
  select.addEventListener('change', render);
  fillOptions();
  render();

  /* --- Abas --- */
  const tabs = $$('[role="tab"]', tool);
  const activate = tab => {
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', on);
      t.tabIndex = on ? 0 : -1;
      $('#' + t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => activate(t));
    t.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const next = tabs[(i + (e.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length];
      next.focus(); activate(next);
    });
  });

  /* --- Busca --- */
  const list = $('[data-list]', tool);
  const empty = $('[data-empty]', tool);
  const search = $('[data-search]', tool);

  // Monta um índice único a partir da tabela acima
  const index = [];
  const seen = new Set();
  Object.entries(CFOP).forEach(([tipo, ops]) => ops.forEach(op => op.codes.forEach((code, li) => {
    if (!code || seen.has(code)) return;
    seen.add(code);
    index.push({ code, desc: op.desc, tipo, local: LOCAL_LABEL[LOCAIS[li]] });
  })));
  index.sort((a, b) => a.code.localeCompare(b.code));

  const norm = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const highlight = (text, q) => {
    if (!q) return esc(text);
    const i = norm(text).indexOf(q);
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' + esc(text.slice(i + q.length));
  };

  const renderList = () => {
    const q = norm(search.value.trim());
    const rows = index.filter(r => !q || r.code.startsWith(q) || norm(r.desc).includes(q));
    list.innerHTML = rows.map(r => `
      <li>
        <b class="${r.tipo === 'saida' ? 'o' : ''}">${highlight(r.code, q)}</b>
        <span>${highlight(r.desc, q)}<small>${r.tipo === 'saida' ? 'Saída' : 'Entrada'} · ${r.local}</small></span>
      </li>`).join('');
    empty.hidden = rows.length > 0;
  };
  search.addEventListener('input', renderList);
  renderList();
})();

/* ==========================================================================
   NOTÍCIAS: filtro, modal de leitura e vídeo sob demanda
   ========================================================================== */
(() => {
  const grid = $('[data-news]');
  if (!grid) return;

  // Filtro por categoria
  const buttons = $$('[data-filter]');
  buttons.forEach(btn => btn.addEventListener('click', () => {
    const cat = btn.dataset.filter;
    buttons.forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-pressed', b === btn); });
    $$('[data-cat]', grid).forEach(card => {
      card.classList.toggle('is-hidden', cat !== 'todas' && card.dataset.cat !== cat);
    });
  }));

  // Modal
  const modal = $('[data-modal]');
  const open = card => {
    $('[data-modal-meta]', modal).innerHTML = $('.post__meta', card).innerHTML;
    $('[data-modal-title]', modal).textContent = $('h3', card).textContent;
    $('[data-modal-body]', modal).innerHTML = $('.post__body', card).innerHTML;
    if (typeof modal.showModal === 'function') modal.showModal();
    else modal.setAttribute('open', '');
    document.body.classList.add('modal-open');
  };
  const close = () => {
    if (modal.open && typeof modal.close === 'function') modal.close();
    else modal.removeAttribute('open');
  };
  modal.addEventListener('close', () => document.body.classList.remove('modal-open'));
  $$('[data-open]', grid).forEach(b => b.addEventListener('click', () => open(b.closest('.post'))));
  $('[data-modal-close]', modal).addEventListener('click', close);
  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('[data-close]')) close();
  });

  // Vídeo: só carrega o YouTube quando a pessoa clica (página mais leve)
  const play = $('[data-video]', grid);
  play?.addEventListener('click', () => {
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube-nocookie.com/embed/${play.dataset.video}?autoplay=1&rel=0`;
    iframe.title = 'Vídeo institucional IFCT';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    play.replaceWith(iframe);
  }, { once: true });
})();

/* ---------- Máscara de telefone (vale também para formulários criados via JS) ---------- */
document.addEventListener('input', e => {
  const phone = e.target.closest?.('[data-phone]');
  if (!phone) return;
  const d = phone.value.replace(/\D/g, '').slice(0, 11);
  let v = d;
  if (d.length > 2) v = `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length > 7) v = `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  phone.value = v;
});

/* ==========================================================================
   FORMULÁRIO → WhatsApp (funciona sem servidor)
   ========================================================================== */
(() => {
  const form = $('[data-form]');
  if (!form) return;
  const msg = $('[data-form-msg]', form);
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    let ok = true;
    ['nome', 'telefone'].forEach(name => {
      const field = form.elements[name];
      const bad = name === 'telefone' ? field.value.replace(/\D/g, '').length < 10 : !field.value.trim();
      field.closest('.input').classList.toggle('is-invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) {
      msg.className = 'form__msg';
      msg.textContent = 'Preencha seu nome e um WhatsApp válido, com DDD.';
      return;
    }

    const lines = [
      `Olá, IFCT! Vim pelo site.`,
      `Nome: ${data.nome}`,
      data.empresa && `Empresa: ${data.empresa}`,
      data.regime && `Regime: ${data.regime}`,
      `WhatsApp: ${data.telefone}`,
      data.mensagem && `\n${data.mensagem}`,
    ].filter(Boolean).join('\n');

    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines)}`, '_blank', 'noopener');
    msg.className = 'form__msg ok';
    msg.textContent = 'Abrimos o WhatsApp com a sua mensagem. É só enviar!';
    form.reset();
  });
})();
