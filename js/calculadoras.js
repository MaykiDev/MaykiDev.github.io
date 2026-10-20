/* ==========================================================================
   IFCT Contabilidade — calculadoras trabalhistas 2026
   Usa $ e $$ de main.js. Cada calculadora só roda se o formulário existir.
   Ao virar o ano, basta atualizar a tabela TAB abaixo.
   ========================================================================== */
const TAB = {
  minimo: 1621.00,
  // INSS empregado: [limite da faixa, alíquota] — Portaria Interministerial MPS/MF nº 13/2026
  inss: [[1621.00, .075], [2902.84, .09], [4354.27, .12], [8475.55, .14]],
  // IRRF mensal: [limite da faixa, alíquota, parcela a deduzir]
  irrf: [[2428.80, 0, 0], [2826.65, .075, 182.16], [3751.05, .15, 394.16], [4664.68, .225, 675.49], [Infinity, .275, 908.73]],
  dependente: 189.59,
  simplificado: 607.20,
  // Redução do IR (Lei 15.270/2025): zera até R$ 5 mil e diminui até R$ 7.350
  reducao: { isentoAte: 5000, max: 312.89, ate: 7350, a: 978.62, b: .133145 },
  // Seguro-desemprego (MTE, vigente desde 11/01/2026)
  seguro: { faixa1: 2222.17, faixa2: 3703.99, fixo: 1777.74, teto: 2518.65 },
};

/* ---------- Utilitários ---------- */
const r2 = n => Math.round(n * 100) / 100;
const brl = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const pct = n => `${(n * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;
const parseMoney = v => (+String(v).replace(/\D/g, '').slice(0, 11) || 0) / 100;
const fmtMoney = n => n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const toDate = s => { if (!s) return null; const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const fmtDate = d => d.toLocaleDateString('pt-BR');
const DAY = 864e5;

function inss(base) {
  let prev = 0, total = 0;
  for (const [lim, aliq] of TAB.inss) {
    if (base <= prev) break;
    total += (Math.min(base, lim) - prev) * aliq;
    prev = lim;
  }
  return r2(total);
}

const irTabela = base => {
  if (base <= 0) return 0;
  const [, aliq, ded] = TAB.irrf.find(([lim]) => base <= lim);
  return Math.max(0, base * aliq - ded);
};

// IRRF mensal: testa deduções legais x desconto simplificado e aplica a redução de 2026
function irrf(renda, { inss: vInss = 0, deps = 0, pensao = 0 } = {}) {
  const legal = Math.max(0, renda - vInss - deps * TAB.dependente - pensao);
  const simpl = Math.max(0, renda - TAB.simplificado);
  const usaSimpl = irTabela(simpl) < irTabela(legal);
  const bruto = irTabela(usaSimpl ? simpl : legal);
  const R = TAB.reducao;
  let reducao = 0;
  if (renda <= R.isentoAte) reducao = Math.min(bruto, R.max);
  else if (renda <= R.ate) reducao = Math.min(bruto, Math.max(0, R.a - R.b * renda));
  return { valor: r2(bruto - reducao), bruto: r2(bruto), reducao: r2(reducao), usaSimpl };
}

/* ---------- Campos de dinheiro (máscara 0,00) e datas de hoje ---------- */
$$('[data-money]').forEach(inp => {
  inp.addEventListener('input', () => { inp.value = fmtMoney(parseMoney(inp.value)); });
  inp.addEventListener('focus', () => inp.select());
});
$$('[data-today]').forEach(inp => {
  if (inp.value) return;
  const d = new Date();
  inp.value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
});

/* ---------- Motor comum: lê o formulário, calcula e desenha o resultado ---------- */
const COR = { a: 'var(--orange-400)', b: 'var(--blue-500)', c: '#8fb0ff', d: 'rgb(255 255 255 / .4)', e: '#ffa497' };

const read = form => Object.fromEntries([...form.elements].filter(el => el.name).map(el => [
  el.name,
  el.type === 'checkbox' ? el.checked : 'money' in el.dataset ? parseMoney(el.value) : el.value,
]));

const lineHTML = l => l.head
  ? `<li class="head">${l.head}</li>`
  : `<li class="${l.neg ? 'neg' : ''}${l.tot ? ' tot' : ''}"><span>${l.label}${l.note ? `<small>${l.note}</small>` : ''}</span><b>${l.text ?? (l.neg ? '− ' : '') + brl(l.value)}</b></li>`;

function calc(name, fn) {
  const form = $(`[data-calc="${name}"]`);
  if (!form) return;
  const out = $('[data-out]', form.parentElement);
  const totalEl = $('[data-total]', out);

  const run = () => {
    const r = fn(read(form), form);
    if (totalEl.textContent !== r.total) {
      out.classList.remove('flash');
      void out.offsetWidth; // reinicia a animação
      out.classList.add('flash');
    }
    totalEl.textContent = r.total;
    $('[data-sub]', out).innerHTML = r.sub || '';
    $('[data-alert]', out).innerHTML = r.alert || '';

    const parts = (r.split || []).filter(p => p.value > 0);
    const sum = parts.reduce((s, p) => s + p.value, 0);
    $('[data-split]', out).innerHTML = parts.map(p => `<span style="--w:${p.value / sum * 100}%;--c:${p.color}"></span>`).join('');
    $('[data-split]', out).hidden = !parts.length;
    $('[data-legend]', out).innerHTML = parts.map(p => `<li><i style="--c:${p.color}"></i>${p.label} · ${pct(p.value / sum)}</li>`).join('');
    $('[data-lines]', out).innerHTML = (r.lines || []).filter(Boolean).map(lineHTML).join('');
    $('[data-extra]', out).innerHTML = r.extra || '';
  };

  form.addEventListener('input', run);
  form.addEventListener('change', run);
  form.addEventListener('submit', e => e.preventDefault());
  run();
}

/* ==========================================================================
   SALÁRIO LÍQUIDO
   ========================================================================== */
calc('salario', f => {
  const bruto = f.bruto;
  if (!bruto) return { total: brl(0), alert: 'Informe o salário bruto para calcular.' };

  const deps = Math.max(0, parseInt(f.dependentes, 10) || 0);
  const vInss = inss(bruto);
  const ir = irrf(bruto, { inss: vInss, deps, pensao: f.pensao });
  const vt = f.vt ? r2(bruto * .06) : 0;
  const outros = vt + f.pensao + f.outros;
  const desc = vInss + ir.valor + outros;
  const liq = bruto - desc;

  let irNote = ir.usaSimpl ? 'Com desconto simplificado' : 'Com deduções legais';
  if (ir.reducao && !ir.valor) irNote = 'Isento pela redução de 2026';
  else if (ir.reducao) irNote += ` e redução de ${brl(ir.reducao)}`;
  else if (!ir.bruto) irNote = 'Base dentro da faixa de isenção';

  return {
    total: brl(liq),
    sub: `Descontos de <b>${brl(desc)}</b> · ${pct(desc / bruto)} do bruto`,
    alert: bruto < TAB.minimo ? 'Valor abaixo do salário mínimo de 2026 (R$ 1.621,00).' : '',
    split: [
      { label: 'Líquido', value: Math.max(0, liq), color: COR.a },
      { label: 'INSS', value: vInss, color: COR.b },
      { label: 'IRRF', value: ir.valor, color: COR.c },
      { label: 'Outros', value: outros, color: COR.d },
    ],
    lines: [
      { label: 'Salário bruto', value: bruto },
      { label: 'INSS', note: `Alíquota efetiva de ${pct(vInss / bruto)}`, value: vInss, neg: true },
      { label: 'IRRF', note: irNote, value: ir.valor, neg: true },
      f.pensao && { label: 'Pensão alimentícia', value: f.pensao, neg: true },
      vt && { label: 'Vale-transporte', note: '6% do salário', value: vt, neg: true },
      f.outros && { label: 'Outros descontos', value: f.outros, neg: true },
      { label: 'Salário líquido', value: liq, tot: true },
    ],
    extra: `<div class="out__box"><ul class="lines">
      ${lineHTML({ label: 'FGTS depositado pela empresa', note: '8% do bruto, não sai do seu salário', value: r2(bruto * .08) })}
    </ul></div>`,
  };
});

/* ==========================================================================
   CUSTO DO EMPREGADO CLT
   ========================================================================== */
calc('custo', (f, form) => {
  const simples = f.regime === 'simples';
  const anexo4 = f.regime === 'anexo4';
  $('[data-rat]', form).hidden = simples;
  $('[data-terceiros]', form).hidden = simples || anexo4;

  const S = f.salario;
  if (!S) return { total: brl(0), alert: 'Informe o salário para calcular.' };

  const d13 = S / 12;
  const ferias = S / 12 * 4 / 3;
  const base = S + d13 + ferias; // encargos incidem também sobre 13º e férias
  const ratP = +f.rat / 100;
  const tercP = (parseFloat(String(f.terceiros).replace(',', '.')) || 0) / 100;

  const fgts = base * .08;
  const cpp = simples ? 0 : base * .2;
  const rat = simples ? 0 : base * ratP;
  const terc = simples || anexo4 ? 0 : base * tercP;
  const multa = f.multa ? fgts * .4 : 0;
  const vt = Math.max(0, f.vt - S * .06);
  const beneficios = vt + f.vr + f.saude + f.outros;
  const provisoes = d13 + ferias;
  const encargos = fgts + cpp + rat + terc + multa;
  const total = r2(S + provisoes + encargos + beneficios);
  const mult = (total / S).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return {
    total: brl(total),
    sub: `<b>${brl(total * 12)}</b> por ano · ${mult}× o salário`,
    split: [
      { label: 'Salário', value: S, color: COR.a },
      { label: 'Provisões', value: provisoes, color: COR.b },
      { label: 'Encargos', value: encargos, color: COR.c },
      { label: 'Benefícios', value: beneficios, color: COR.d },
    ],
    lines: [
      { head: 'Remuneração' },
      { label: 'Salário', value: S },
      { head: 'Provisões mensais' },
      { label: '13º salário', note: '1/12 do salário', value: d13 },
      { label: 'Férias + 1/3', note: '1/12 do salário + 1/3', value: ferias },
      { head: 'Encargos' },
      { label: 'FGTS', note: '8% sobre salário, 13º e férias', value: fgts },
      simples
        ? { label: 'INSS patronal (CPP)', note: 'Já recolhido dentro do DAS', text: 'no DAS' }
        : { label: 'INSS patronal (CPP)', note: '20%', value: cpp },
      rat && { label: 'RAT', note: pct(ratP), value: rat },
      terc && { label: 'Terceiros (Sistema S)', note: pct(tercP), value: terc },
      multa && { label: 'Provisão multa FGTS', note: '40% do FGTS do mês', value: multa },
      beneficios && { head: 'Benefícios' },
      vt && { label: 'Vale-transporte', note: 'Gasto menos 6% descontado do empregado', value: vt },
      f.vr && { label: 'Vale-refeição / alimentação', value: f.vr },
      f.saude && { label: 'Plano de saúde', value: f.saude },
      f.outros && { label: 'Outros benefícios', value: f.outros },
      { label: 'Custo mensal total', value: total, tot: true },
    ],
  };
});

/* ==========================================================================
   SEGURO-DESEMPREGO
   ========================================================================== */
calc('seguro', f => {
  const sal = [f.s1, f.s2, f.s3].filter(v => v > 0);
  if (!sal.length) return { total: brl(0), alert: 'Informe pelo menos o último salário.' };

  if (!['sem-justa', 'indireta'].includes(f.motivo)) {
    return {
      total: 'Sem direito',
      alert: 'O seguro-desemprego é pago só em demissão sem justa causa ou rescisão indireta. Pedido de demissão, justa causa e acordo (art. 484-A) não dão direito ao benefício.',
    };
  }

  const S = TAB.seguro;
  const media = sal.reduce((a, b) => a + b, 0) / sal.length;
  let parcela, regra;
  if (media <= S.faixa1) { parcela = media * .8; regra = '80% da média'; }
  else if (media <= S.faixa2) { parcela = S.fixo + (media - S.faixa1) * .5; regra = 'R$ 1.777,74 + 50% do excedente'; }
  else { parcela = S.teto; regra = 'Teto da tabela'; }
  if (parcela < TAB.minimo) { parcela = TAB.minimo; regra = 'Salário mínimo (piso)'; }
  parcela = r2(parcela);

  const vez = +f.vez;
  const meses = parseInt(f.meses, 10) || 0;
  const minimo = { 1: 12, 2: 9, 3: 6 }[vez];
  const n = meses >= 24 ? 5 : meses >= 12 ? 4 : meses >= minimo ? 3 : 0;

  if (!n) {
    return {
      total: 'Sem direito',
      alert: `Na ${vez}ª solicitação é preciso ter trabalhado pelo menos ${minimo} meses${vez === 3 ? ' seguidos antes da demissão' : vez === 2 ? ' nos últimos 12 meses' : ' nos últimos 18 meses'}.`,
      lines: [{ label: 'Média salarial', note: `${sal.length} salário(s)`, value: media }],
    };
  }

  const dem = toDate(f.demissao);
  return {
    total: brl(parcela),
    sub: `${n} parcelas · total de <b>${brl(parcela * n)}</b>`,
    lines: [
      { label: 'Média salarial', note: `${sal.length} último(s) salário(s)`, value: media },
      { label: 'Regra aplicada', text: regra },
      { label: 'Quantidade de parcelas', note: `${meses} meses trabalhados · ${vez}ª solicitação`, text: `${n}` },
      dem && { label: 'Prazo para pedir', note: 'Do 7º ao 120º dia após a demissão', text: `${fmtDate(addDays(dem, 7))} a ${fmtDate(addDays(dem, 120))}` },
      { label: 'Total a receber', value: parcela * n, tot: true },
    ],
    extra: `<ol class="parcels" aria-label="Parcelas">${Array.from({ length: n }, (_, i) =>
      `<li style="animation-delay:${i * 60}ms"><small>${i + 1}ª parcela</small><b>${brl(parcela)}</b></li>`).join('')}</ol>`,
  };
});

/* ==========================================================================
   RESCISÃO
   ========================================================================== */
// Meses civis com 15 dias ou mais entre duas datas (avos de 13º)
function avosCivis(from, to) {
  let n = 0, y = from.getFullYear(), m = from.getMonth();
  while (y < to.getFullYear() || (y === to.getFullYear() && m <= to.getMonth())) {
    const ini = Math.max(new Date(y, m, 1), from);
    const fim = Math.min(new Date(y, m + 1, 0), to);
    if (Math.round((fim - ini) / DAY) + 1 >= 15) n++;
    if (++m > 11) { m = 0; y++; }
  }
  return n;
}
// Último aniversário de admissão até a data (início do período aquisitivo de férias)
function ultimoAniversario(adm, data) {
  const a = new Date(data.getFullYear(), adm.getMonth(), adm.getDate());
  if (a > data) a.setFullYear(a.getFullYear() - 1);
  return a < adm ? adm : a;
}
// Avos de férias: meses contados a partir do aniversário, fração de 15+ dias vale 1
function avosFerias(ini, fim) {
  let m = (fim.getFullYear() - ini.getFullYear()) * 12 + fim.getMonth() - ini.getMonth();
  let ref = new Date(ini.getFullYear(), ini.getMonth() + m, ini.getDate());
  if (ref > fim) ref = new Date(ini.getFullYear(), ini.getMonth() + --m, ini.getDate());
  return Math.min(12, m + (Math.round((fim - ref) / DAY) + 1 >= 15 ? 1 : 0));
}
const anosCompletos = (a, b) => {
  let y = b.getFullYear() - a.getFullYear();
  if (b.getMonth() < a.getMonth() || (b.getMonth() === a.getMonth() && b.getDate() < a.getDate())) y--;
  return Math.max(0, y);
};

const AVISO_OPCOES = {
  'sem-justa': [['indenizado', 'Indenizado (sem trabalhar)'], ['trabalhado', 'Trabalhado']],
  acordo: [['indenizado', 'Indenizado (metade)'], ['trabalhado', 'Trabalhado']],
  pedido: [['trabalhado', 'Cumprido (trabalhado)'], ['descontado', 'Não cumprido (descontado)'], ['dispensado', 'Dispensado pela empresa']],
  justa: [],
};

calc('rescisao', (f, form) => {
  // Opções de aviso prévio mudam conforme o motivo
  const sel = form.elements.aviso;
  const opts = AVISO_OPCOES[f.motivo];
  const key = f.motivo;
  if (sel.dataset.key !== key) {
    const keep = sel.value;
    sel.innerHTML = opts.map(([v, l]) => `<option value="${v}">${l}</option>`).join('');
    sel.dataset.key = key;
    if (opts.some(([v]) => v === keep)) sel.value = keep;
  }
  $('[data-aviso-field]', form).hidden = !opts.length;
  const aviso = opts.length ? sel.value : '';

  const S = f.salario;
  const adm = toDate(f.admissao);
  const saida = toDate(f.saida);
  if (!S) return { total: brl(0), alert: 'Informe o salário para calcular.' };
  if (!adm || !saida || saida < adm) return { total: '—', alert: 'Confira as datas: o desligamento precisa ser depois da admissão.' };

  const justa = f.motivo === 'justa';
  const acordo = f.motivo === 'acordo';
  const dia = S / 30;
  const avisoDias = Math.min(90, 30 + 3 * anosCompletos(adm, saida));
  const indenizado = aviso === 'indenizado';
  // O aviso indenizado conta como tempo de serviço (projeção para 13º e férias)
  const fim = indenizado ? addDays(saida, avisoDias) : saida;

  const diasSaldo = Math.min(saida.getDate(), 30);
  const saldo = dia * diasSaldo;
  const vAviso = indenizado ? dia * avisoDias * (acordo ? .5 : 1) : 0;

  const a13 = justa ? 0 : avosCivis(adm > new Date(saida.getFullYear(), 0, 1) ? adm : new Date(saida.getFullYear(), 0, 1), fim);
  const v13 = S * a13 / 12;

  // Se a projeção do aviso completar um período aquisitivo, ele vira férias vencidas
  const iniPeriodo = ultimoAniversario(adm, fim);
  const ganhouPeriodo = iniPeriodo > ultimoAniversario(adm, saida) ? 1 : 0;
  const nVencidas = +f.vencidas + ganhouPeriodo;
  const vVencidas = nVencidas * S * 4 / 3;
  const aFerias = justa ? 0 : avosFerias(iniPeriodo, fim);
  const vFerias = S * aFerias / 12 * 4 / 3;

  // Descontos: INSS e IRRF sobre saldo e 13º, separadamente
  const inssSaldo = inss(saldo);
  const irSaldo = irrf(saldo, { inss: inssSaldo }).valor;
  const inss13 = inss(v13);
  const ir13 = irrf(v13, { inss: inss13 }).valor;
  const descAviso = aviso === 'descontado' ? S : 0;

  const bruto = saldo + vAviso + v13 + vVencidas + vFerias;
  const desc = inssSaldo + irSaldo + inss13 + ir13 + descAviso;
  const liquido = r2(bruto - desc);

  // FGTS (pago em guia própria, fora do termo de rescisão)
  const meses = (saida - adm) / DAY / 30.44;
  const saldoFgts = f.fgts || S * .08 * meses * (1 + 1 / 12 + 1 / 36);
  const deposito = (saldo + v13 + vAviso) * .08;
  const multaP = f.motivo === 'sem-justa' ? .4 : acordo ? .2 : 0;
  const multa = (saldoFgts + deposito) * multaP;
  const saque = multaP ? (saldoFgts + deposito + multa) * (acordo ? .8 : 1) : 0;

  const alerts = [];
  if (justa) alerts.push('Na justa causa, o empregado perde aviso prévio, 13º e férias proporcionais e a multa do FGTS.');
  if (descAviso) alerts.push('Como o aviso não foi cumprido, a empresa pode descontar um salário.');
  if (ganhouPeriodo) alerts.push('A projeção do aviso prévio completou mais um período de férias, que entrou como férias vencidas.');
  if (liquido < 0) alerts.push('Os descontos superam as verbas: o saldo fica negativo para o empregado.');

  return {
    total: brl(liquido),
    sub: `Bruto <b>${brl(bruto)}</b> · descontos <b>${brl(desc)}</b>`,
    alert: alerts.join(' '),
    split: [
      { label: 'Saldo', value: saldo, color: COR.a },
      { label: 'Aviso', value: vAviso, color: COR.b },
      { label: '13º', value: v13, color: COR.c },
      { label: 'Férias', value: vVencidas + vFerias, color: COR.d },
    ],
    lines: [
      { head: 'Verbas rescisórias' },
      { label: 'Saldo de salário', note: `${diasSaldo} dias`, value: saldo },
      vAviso && { label: 'Aviso prévio indenizado', note: `${avisoDias} dias${acordo ? ' · metade no acordo' : ''}`, value: vAviso },
      !justa && { label: '13º salário proporcional', note: `${a13}/12 avos`, value: v13 },
      vVencidas && { label: 'Férias vencidas + 1/3', note: `${nVencidas} período(s)`, value: vVencidas },
      !justa && { label: 'Férias proporcionais + 1/3', note: `${aFerias}/12 avos`, value: vFerias },
      { head: 'Descontos' },
      { label: 'INSS sobre saldo de salário', value: inssSaldo, neg: true },
      irSaldo && { label: 'IRRF sobre saldo de salário', value: irSaldo, neg: true },
      inss13 && { label: 'INSS sobre 13º', value: inss13, neg: true },
      ir13 && { label: 'IRRF sobre 13º', value: ir13, neg: true },
      descAviso && { label: 'Aviso prévio não cumprido', value: descAviso, neg: true },
      { label: 'Total líquido', value: liquido, tot: true },
    ],
    extra: `<div class="out__box">
      <span class="out__kicker">FGTS · pago em guia à parte</span>
      <ul class="lines">
        ${lineHTML({ label: 'Saldo da conta', note: f.fgts ? 'Informado por você' : 'Estimado pelo tempo de contrato', value: saldoFgts })}
        ${lineHTML({ label: 'Depósito do mês da rescisão', note: '8% sobre saldo, 13º e aviso', value: deposito })}
        ${multaP ? lineHTML({ label: `Multa de ${multaP * 100}%`, note: 'Paga pela empresa', value: multa }) : ''}
        ${lineHTML(multaP
          ? { label: 'Disponível para saque', note: acordo ? 'Até 80% no acordo' : 'Saldo + multa', value: saque, tot: true }
          : { label: 'Saque', note: 'O saldo fica na conta do FGTS', text: 'Não liberado' })}
      </ul>
      <p class="out__note">Quem optou pelo saque-aniversário saca só a multa na demissão. Prazo de pagamento da rescisão: até 10 dias após o fim do contrato.</p>
    </div>`,
  };
});
