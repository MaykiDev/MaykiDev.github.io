/* ==========================================================================
   IFCT Contabilidade — eventos
   Usa $, $$ e WHATSAPP de main.js.

   COMO ADICIONAR UM EVENTO: copie um bloco da lista EVENTOS e altere os campos.
   - id: aparece no link (evento.html?id=...). Use letras minúsculas e hífens.
   - inicio / fim: 'AAAA-MM-DDTHH:MM' no horário local do evento.
   - capa (opcional): caminho de uma imagem, ex.: 'assent/eventos/reforma.jpg'.
   - cor: 'b' (azul) ou 'o' (laranja) para a capa gerada quando não há imagem.
   - gravacao (opcional): link do vídeo, exibido depois que o evento acontece.
   O evento sai sozinho de "Próximos" e vai para "Já aconteceram" após a data.

   ATENÇÃO: os eventos abaixo são EXEMPLOS. Troque pelos eventos reais da IFCT.
   ========================================================================== */
const EVENTOS = [
  {
    id: 'reforma-tributaria-na-pratica',
    titulo: 'Reforma Tributária na prática: prepare sua empresa para 2027',
    tipo: 'Workshop presencial',
    inicio: '2026-11-19T19:00',
    fim: '2026-11-19T22:00',
    local: 'Sede IFCT',
    endereco: 'Endereço da sede IFCT', // TODO: endereço completo
    preco: 'Gratuito',
    vagas: '60 vagas',
    cor: 'o',
    resumo: 'Em 2027 a CBS entra para valer e PIS e COFINS deixam de existir. Veja, com exemplos reais, o que muda no preço, na nota fiscal e no caixa.',
    descricao: [
      'A Reforma Tributária saiu do papel. Em 2026 os novos tributos já aparecem nas notas em caráter de teste e, a partir de 2027, a CBS substitui o PIS e a COFINS de vez.',
      'Neste workshop, a equipe tributária da IFCT mostra, com simulações de empresas do Lucro Real, Presumido e Simples, o que fazer agora para não ser pego de surpresa: cadastro de produtos, formação de preço, contratos e créditos.',
    ],
    aprender: [
      'O calendário completo da transição, de 2026 a 2033',
      'Como a CBS e o IBS são calculados e destacados na nota',
      'O impacto no preço de venda e na margem, com simulações reais',
      'O que revisar agora no cadastro de produtos e no ERP',
      'Como fica o Simples Nacional e quando vale a pena sair dele',
    ],
    publico: 'Empresários, diretores financeiros, controllers e equipes fiscais.',
    programacao: [
      { hora: '19:00', titulo: 'Credenciamento e café', desc: 'Recepção na sede da IFCT.' },
      { hora: '19:30', titulo: 'O que já mudou e o que vem em 2027', desc: 'Panorama da transição e o fim do PIS e da COFINS.' },
      { hora: '20:15', titulo: 'Simulações: preço, margem e caixa', desc: 'Casos reais de comércio, indústria e serviços.' },
      { hora: '21:15', titulo: 'Checklist de adequação', desc: 'O que fazer nos próximos 90 dias.' },
      { hora: '21:40', titulo: 'Perguntas e networking', desc: '' },
    ],
    palestrantes: [
      { nome: 'Thiago Cavenaghi', cargo: 'Sócio-fundador da IFCT' },
      { nome: 'Equipe Tributária IFCT', cargo: 'Especialistas em Lucro Real' },
    ],
  },
  {
    id: 'fechamento-fiscal-2026',
    titulo: 'Fechamento do ano: checklist fiscal e contábil para o Lucro Real',
    tipo: 'Webinar online',
    inicio: '2026-12-03T10:00',
    fim: '2026-12-03T11:30',
    local: 'Online, ao vivo',
    endereco: 'O link de acesso é enviado pelo WhatsApp após a inscrição.',
    preco: 'Gratuito',
    vagas: 'Vagas ilimitadas',
    cor: 'b',
    resumo: 'Inventário, provisões, créditos e a ECF: o que conferir antes de 31 de dezembro para fechar o ano sem sustos.',
    descricao: [
      'Dezembro é o último mês para ajustar decisões que mudam o imposto do ano inteiro. Um fechamento bem feito evita autuações e pode reduzir o IRPJ e a CSLL.',
      'Em 90 minutos, passamos pelo checklist que a IFCT usa com os próprios clientes do Lucro Real.',
    ],
    aprender: [
      'Conferência de estoque e inventário',
      'Provisões dedutíveis e indedutíveis',
      'Créditos de PIS e COFINS que costumam ficar para trás',
      'Balanço de suspensão e redução x estimativa mensal',
      'Prazos de ECD, ECF e e-Lalur',
    ],
    publico: 'Empresas do Lucro Real e equipes financeiras.',
    programacao: [
      { hora: '10:00', titulo: 'Abertura', desc: '' },
      { hora: '10:10', titulo: 'Checklist contábil de fechamento', desc: 'Estoque, provisões, conciliações.' },
      { hora: '10:45', titulo: 'Oportunidades fiscais de dezembro', desc: 'Créditos e ajustes no e-Lalur.' },
      { hora: '11:15', titulo: 'Perguntas ao vivo', desc: '' },
    ],
    palestrantes: [
      { nome: 'Equipe Contábil IFCT', cargo: 'Especialistas em Lucro Real' },
    ],
  },
  {
    id: 'cafe-empresarial-2027',
    titulo: 'Café com Empresários: planejamento tributário para 2027',
    tipo: 'Encontro presencial',
    inicio: '2027-02-25T08:00',
    fim: '2027-02-25T10:30',
    local: 'Sede IFCT',
    endereco: 'Endereço da sede IFCT', // TODO: endereço completo
    preco: 'Gratuito para convidados',
    vagas: '30 vagas',
    cor: 'b',
    resumo: 'Um café da manhã para trocar experiências e começar o ano com o regime tributário certo e metas fiscais claras.',
    descricao: [
      'Um encontro informal e próximo, em grupo pequeno, para empresários discutirem com a IFCT as decisões tributárias que mais pesam no ano.',
      'Traga suas dúvidas: pró-labore x dividendos, troca de regime, holding e o primeiro ano da CBS.',
    ],
    aprender: [
      'Como escolher o regime tributário de 2027',
      'Remuneração dos sócios depois da tributação de dividendos',
      'Quando a holding faz sentido',
    ],
    publico: 'Sócios e diretores de empresas de todos os regimes.',
    programacao: [
      { hora: '08:00', titulo: 'Café da manhã', desc: '' },
      { hora: '08:40', titulo: 'Bate-papo: o ano tributário de 2027', desc: '' },
      { hora: '09:40', titulo: 'Rodada de perguntas', desc: '' },
    ],
    palestrantes: [
      { nome: 'Thiago Cavenaghi', cargo: 'Sócio-fundador da IFCT' },
    ],
  },
  {
    id: 'dp-sem-erros-esocial',
    titulo: 'Departamento pessoal sem erros: eSocial e FGTS Digital',
    tipo: 'Webinar online',
    inicio: '2026-08-27T15:00',
    fim: '2026-08-27T16:30',
    local: 'Online, ao vivo',
    endereco: '',
    preco: 'Gratuito',
    vagas: '',
    cor: 'o',
    gravacao: 'https://www.youtube.com/@thiagocavenaghi', // TODO: link do vídeo
    resumo: 'Os erros mais comuns no eSocial que viram multa e como o FGTS Digital mudou o fechamento da folha.',
    descricao: [
      'Com o FGTS Digital, qualquer divergência no eSocial aparece direto na guia. Neste webinar mostramos como organizar admissões, férias e desligamentos para fechar a folha sem retrabalho.',
    ],
    aprender: [
      'Prazos de envio dos eventos do eSocial',
      'Como a guia do FGTS Digital é gerada',
      'Os erros que mais geram multa',
    ],
    publico: 'Empresários e equipes de RH e DP.',
    programacao: [],
    palestrantes: [
      { nome: 'Equipe de DP IFCT', cargo: 'Departamento pessoal' },
    ],
  },
];

/* ---------- Utilitários ---------- */
const evInicio = e => new Date(e.inicio);
const evFim = e => new Date(e.fim || e.inicio);
const evPassou = e => evFim(e) < new Date();
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const dataLonga = d => d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
const hora = d => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const iniciais = nome => nome.split(' ').filter(p => p.length > 2).slice(0, 2).map(p => p[0]).join('').toUpperCase();

const capa = e => {
  const d = evInicio(e);
  const mes = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  return `<div class="ev-cover${e.cor === 'o' ? ' ev-cover--o' : ''}">
      ${e.capa ? `<img src="${esc(e.capa)}" alt="" loading="lazy">` : ''}
      <span class="ev-cover__kind">${esc(e.tipo)}</span>
      <span class="ev-date"><b>${d.getDate()}</b><small>${mes} ${d.getFullYear()}</small></span>
      <span class="ev-status${evPassou(e) ? ' ev-status--off' : ''}">${evPassou(e) ? 'Encerrado' : 'Inscrições abertas'}</span>
    </div>`;
};

/* ==========================================================================
   LISTAGEM (eventos.html)
   ========================================================================== */
(() => {
  const list = $('[data-ev-list]');
  if (!list) return;
  const buttons = $$('[data-ev-filter]');

  const render = filtro => {
    let evs = EVENTOS.filter(e => filtro === 'todos' || (filtro === 'anteriores') === evPassou(e));
    // Próximos: do mais perto para o mais longe. Anteriores: do mais recente para o mais antigo.
    evs.sort((a, b) => filtro === 'proximos' ? evInicio(a) - evInicio(b) : evInicio(b) - evInicio(a));

    if (!evs.length) {
      list.innerHTML = `<p class="ev-empty">${filtro === 'proximos'
        ? 'Nenhum evento agendado no momento. Siga <a href="https://www.instagram.com/ifctoficial/" target="_blank" rel="noopener"><b>@ifctoficial</b></a> para saber dos próximos.'
        : 'Nenhum evento por aqui ainda.'}</p>`;
      return;
    }

    list.innerHTML = evs.map((e, i) => {
      const d = evInicio(e);
      return `<article class="ev-card${i === 0 && filtro === 'proximos' ? ' ev-card--feature' : ''}${evPassou(e) ? ' is-past' : ''}">
    ${capa(e)}
    <div class="ev-card__body">
      <h2>${esc(e.titulo)}</h2>
      <p>${esc(e.resumo)}</p>
      <ul class="ev-meta">
        <li><svg><use href="#i-cal"/></svg>${dataLonga(d)}</li>
        <li><svg><use href="#i-clock"/></svg>${hora(d)} às ${hora(evFim(e))}</li>
        <li><svg><use href="#i-pin"/></svg>${esc(e.local)}</li>
      </ul>
      <a class="tool-card__go" href="evento.html?id=${encodeURIComponent(e.id)}">${evPassou(e) ? 'Ver detalhes' : 'Ver evento e inscrever-se'} <svg><use href="#i-arrow"/></svg></a>
    </div>
  </article>`;
    }).join('');
  };

  buttons.forEach(btn => btn.addEventListener('click', () => {
    buttons.forEach(b => { b.classList.toggle('is-active', b === btn); b.setAttribute('aria-pressed', b === btn); });
    render(btn.dataset.evFilter);
  }));
  render('proximos');
})();

/* ==========================================================================
   PÁGINA DO EVENTO (evento.html?id=...)
   ========================================================================== */
(() => {
  const root = $('[data-ev-page]');
  if (!root) return;
  const slot = name => $(`[data-ev="${name}"]`, root);

  const id = new URLSearchParams(location.search).get('id');
  const e = EVENTOS.find(ev => ev.id === id);

  if (!e) {
    slot('titulo').textContent = 'Evento não encontrado';
    slot('resumo').textContent = 'O link pode estar incompleto ou o evento foi removido da agenda.';
    slot('acoes').innerHTML = '<a class="btn btn--orange" href="eventos.html">Ver todos os eventos <svg><use href="#i-arrow"/></svg></a>';
    root.querySelector('.ev-layout').closest('section').hidden = true;
    return;
  }

  const ini = evInicio(e), fim = evFim(e);
  const passou = evPassou(e);
  document.title = `${e.titulo} — Eventos IFCT`;
  $('meta[name="description"]')?.setAttribute('content', e.resumo);

  /* --- Topo --- */
  slot('crumb').textContent = e.titulo;
  slot('tipo').textContent = e.tipo;
  slot('titulo').textContent = e.titulo;
  slot('resumo').textContent = e.resumo;
  slot('meta').innerHTML = [
    ['i-cal', dataLonga(ini)],
    ['i-clock', `${hora(ini)} às ${hora(fim)}`],
    ['i-pin', e.local],
    ['i-tag', e.preco],
  ].filter(([, t]) => t).map(([icon, t]) => `<li><svg><use href="#${icon}"/></svg>${esc(t)}</li>`).join('');
  slot('acoes').innerHTML = passou
    ? (e.gravacao ? `<a class="btn btn--orange" href="${esc(e.gravacao)}" target="_blank" rel="noopener">Assistir à gravação <svg><use href="#i-arrow-up"/></svg></a>` : '')
      + '<a class="btn btn--ghost-light" href="eventos.html">Ver próximos eventos</a>'
    : '<a class="btn btn--orange" href="#inscricao">Garantir minha vaga <svg><use href="#i-arrow"/></svg></a>';

  /* --- Contagem regressiva --- */
  if (!passou) {
    const card = slot('contagem');
    card.hidden = false;
    slot('quando').innerHTML = `<b>${dataLonga(ini)}</b>, às ${hora(ini)}`;
    const cd = k => $(`[data-cd="${k}"]`, card);
    const tick = () => {
      const ms = Math.max(0, ini - new Date());
      const s = Math.floor(ms / 1000);
      cd('d').textContent = Math.floor(s / 86400);
      cd('h').textContent = String(Math.floor(s / 3600) % 24).padStart(2, '0');
      cd('m').textContent = String(Math.floor(s / 60) % 60).padStart(2, '0');
      cd('s').textContent = String(s % 60).padStart(2, '0');
      if (!ms) { $('p', card).textContent = 'Acontecendo agora'; clearInterval(timer); }
    };
    const timer = setInterval(tick, 1000);
    tick();
  }

  /* --- Conteúdo --- */
  slot('conteudo').innerHTML = `
    <section class="ev-block">
      <p class="eyebrow">Sobre o evento</p>
      <h2>${passou ? 'O que rolou' : 'Por que participar'}</h2>
      ${e.descricao.map(p => `<p>${esc(p)}</p>`).join('')}
      ${e.publico ? `<p><strong>Para quem é:</strong> ${esc(e.publico)}</p>` : ''}
    </section>
    ${e.aprender?.length ? `<section class="ev-block">
      <h2>O que você vai aprender</h2>
      <ul class="checks">${e.aprender.map(a => `<li><svg><use href="#i-check"/></svg>${esc(a)}</li>`).join('')}</ul>
    </section>` : ''}
    ${e.programacao?.length ? `<section class="ev-block">
      <h2>Programação</h2>
      <ol class="agenda">${e.programacao.map(p => `<li><time>${esc(p.hora)}</time><div><b>${esc(p.titulo)}</b>${p.desc ? `<p>${esc(p.desc)}</p>` : ''}</div></li>`).join('')}</ol>
    </section>` : ''}
    ${e.palestrantes?.length ? `<section class="ev-block">
      <h2>Quem conduz</h2>
      <div class="speakers">${e.palestrantes.map(p => `<div class="speaker"><span class="avatar">${iniciais(p.nome)}</span><div><b>${esc(p.nome)}</b><small>${esc(p.cargo)}</small></div></div>`).join('')}</div>
    </section>` : ''}
    ${e.endereco ? `<section class="ev-block">
      <h2>Local</h2>
      <p><strong>${esc(e.local)}</strong><br>${esc(e.endereco)}</p>
    </section>` : ''}`;

  /* --- Inscrição --- */
  const aside = slot('inscricao');
  if (passou) {
    aside.innerHTML = `<div class="ev-closed">
      <p class="ev-aside__title">Este evento já aconteceu</p>
      <p>Quer ser avisado dos próximos? Deixe seu contato com a gente pelo WhatsApp.</p>
      <a class="btn btn--orange btn--block" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Olá! Quero ser avisado dos próximos eventos da IFCT (vi o evento "${e.titulo}").`)}" target="_blank" rel="noopener"><svg><use href="#i-whats"/></svg>Avise-me dos próximos</a>
    </div>`;
    return;
  }

  aside.innerHTML = `<form class="form" data-ev-form novalidate>
      <p class="ev-aside__title">Garanta sua vaga</p>
      <div class="ev-aside__price"><span>${esc(e.preco)}</span><b>${esc(e.vagas || '')}</b></div>
      <label class="input">
        <span>Seu nome *</span>
        <input name="nome" required autocomplete="name">
      </label>
      <label class="input">
        <span>WhatsApp *</span>
        <input name="telefone" type="tel" required inputmode="tel" autocomplete="tel" placeholder="(00) 00000-0000" data-phone>
      </label>
      <label class="input">
        <span>Empresa</span>
        <input name="empresa" autocomplete="organization">
      </label>
      <label class="input">
        <span>Quantas pessoas?</span>
        <input name="pessoas" type="number" min="1" max="20" value="1" inputmode="numeric">
      </label>
      <button class="btn btn--orange btn--block" type="submit">Confirmar inscrição pelo WhatsApp <svg><use href="#i-arrow"/></svg></button>
      <p class="form__msg" data-ev-msg role="status"></p>
      <div class="ev-tools">
        <a class="btn btn--sm btn--line" href="#" data-ics><svg><use href="#i-cal"/></svg>Salvar na agenda</a>
        <button class="btn btn--sm btn--line" type="button" data-share><svg><use href="#i-share"/></svg><span>Compartilhar</span></button>
      </div>
    </form>`;

  const form = $('[data-ev-form]', aside);
  const msg = $('[data-ev-msg]', form);
  form.addEventListener('submit', ev => {
    ev.preventDefault();
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
      'Olá, IFCT! Quero me inscrever no evento:',
      `*${e.titulo}*`,
      `${dataLonga(ini)}, ${hora(ini)}`,
      '',
      `Nome: ${data.nome}`,
      data.empresa ? `Empresa: ${data.empresa}` : null,
      `WhatsApp: ${data.telefone}`,
      `Participantes: ${data.pessoas || 1}`,
    ].filter(l => l !== null).join('\n');
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(lines)}`, '_blank', 'noopener');
    msg.className = 'form__msg ok';
    msg.textContent = 'Abrimos o WhatsApp com a sua inscrição. É só enviar!';
  });

  // Salvar na agenda: arquivo .ics (Outlook, Apple, Google)
  const icsDate = d => `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}${String(d.getMinutes()).padStart(2, '0')}00`;
  $('[data-ics]', form).addEventListener('click', ev => {
    ev.preventDefault();
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//IFCT//Eventos//PT-BR', 'BEGIN:VEVENT',
      `UID:${e.id}@ifctcontabilidade.com.br`,
      `DTSTART:${icsDate(ini)}`, `DTEND:${icsDate(fim)}`,
      `SUMMARY:${e.titulo}`,
      `DESCRIPTION:${e.resumo} ${location.href}`,
      `LOCATION:${[e.local, e.endereco].filter(Boolean).join(' - ')}`,
      'END:VEVENT', 'END:VCALENDAR',
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `${e.id}.ics` });
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  // Compartilhar: menu nativo do celular ou copia o link
  const share = $('[data-share]', form);
  share.addEventListener('click', async () => {
    if (navigator.share) {
      try { await navigator.share({ title: e.titulo, text: e.resumo, url: location.href }); } catch {}
      return;
    }
    try { await navigator.clipboard.writeText(location.href); } catch {}
    $('span', share).textContent = 'Link copiado!';
    setTimeout(() => { $('span', share).textContent = 'Compartilhar'; }, 1800);
  });
})();
