/* 报价雷达 QuoteRadar — 纯前端比价引擎 */

const SAMPLE_A = `物料编码,物料名称,规格型号,单位,单价,数量,金额,交期(天)
BJ-M6-20,内六角螺栓,M6×20,个,0.42,2000,840,7
BJ-M8-30,内六角螺栓,M8×30,个,0.68,1200,816,7
ZC-6204,深沟球轴承,6204,套,12.50,120,1500,10
ZC-6205,深沟球轴承,6205,套,15.20,80,1216,10
LX-6063-40,铝型材,6063 40×40,米,28.00,300,8400,12
LX-6063-30,铝型材,6063 30×30,米,21.50,240,5160,12
DJ-YS90L,三相异步电机,YS-90L 1.5kW,台,486.00,10,4860,20
DG-24V5A,开关电源,24V 5A,个,68.00,60,4080,7
DL-RVV2X1.5,护套线,RVV 2×1.5,米,3.60,1500,5400,7
DL-RVV3X2.5,护套线,RVV 3×2.5,米,6.80,800,5440,7
QJ-PLC-16,PLC 控制器,16 点,台,1280.00,6,7680,25
QJ-PLC-32,PLC 控制器,32 点,台,2160.00,4,8640,25
CG-GS-50,不锈钢管,304 φ50,米,92.00,60,5520,14
CG-GS-25,不锈钢管,304 φ25,米,46.00,80,3680,14
MF-M8,法兰螺母,M8,个,0.36,3000,1080,7
PD-M8,平垫圈,M8,个,0.12,4000,480,7
YQ-QG-10,气缸,SC 10×100,个,78.00,40,3120,15
YQ-DCF-24,电磁阀,24V,个,56.00,50,2800,15
JS-HJ-200,焊接合页,200mm,个,9.80,150,1470,7
JS-LS-50,拉手,50mm,个,4.20,200,840,7
DG-FAN-120,散热风扇,120mm,个,22.00,80,1760,7
DL-KZ-16,航空插头,16 芯,个,32.00,100,3200,10
LJ-LD-30,联轴器,30mm,个,45.00,30,1350,12
CL-6204,齿轮,6204 配套,个,26.00,60,1560,12
QJ-TP-7,触摸屏,7 寸,台,860.00,3,2580,25
DL-BX-100,接线盒,100×100,个,6.50,120,780,7`;

const SAMPLE_B = `物料编码,物料名称,规格型号,单位,单价,数量,金额,交期(天)
BJ-M6-20,内六角螺栓,M6×20,个,0.46,2000,920,7
BJ-M8-30,内六角螺栓,M8×30,个,0.82,1200,984,7
ZC-6204,深沟球轴承,6204,套,13.80,120,1656,10
ZC-6205,深沟球轴承,6205,套,18.90,80,1512,10
LX-6063-40,铝型材,6063 40×40,根,28.00,300,8400,12
LX-6063-30,铝型材,6063 30×30,米,22.40,240,5376,12
DJ-YS90L,三相异步电机,YS-90L 1.5kW,台,520.00,10,5200,20
DG-24V5A,开关电源,24V 5A,个,72.00,60,4200,7
DL-RVV2X1.5,护套线,RVV 2×1.5,米,3.55,1500,5325,7
DL-RVV3X2.5,护套线,RVV 3×2.5,米,7.60,800,6080,7
QJ-PLC-16,PLC 控制器,16 点,台,1290.00,6,7740,25
QJ-PLC-32,PLC 控制器,32 点,台,2160.00,4,8640,25
CG-GS-50,不锈钢管,304 φ50,米,96.50,60,5790,28
CG-GS-25,不锈钢管,304 φ25,米,51.00,80,4080,14
MF-M8,法兰螺母,M8,个,0.36,3000,1080,7
PD-M8,平垫圈,M8,个,0.15,4000,600,7
YQ-QG-10,气缸,SC 10×100,个,82.00,40,3280,15
YQ-DCF-24,电磁阀,24V,个,63.00,50,3150,15
JS-HJ-200,焊接合页,200mm,个,9.80,150,1470,7
JS-LS-50,拉手,50mm,个,4.00,200,800,7
DG-FAN-120,散热风扇,120mm,个,24.50,80,1960,7
DL-KZ-16,航空插头,16 芯,个,32.00,100,3200,10
LJ-LD-30,联轴器,30mm,个,48.00,30,1440,12
CL-6204,齿轮,6204 配套,个,26.00,60,1560,12
ZC-6206,深沟球轴承,6206,套,19.60,40,784,10
DG-FAN-80,散热风扇,80mm,个,18.00,60,1080,7`;

const state = {
  a: null,
  b: null,
  result: null,
  filter: 'all',
  sort: { key: 'impact', dir: -1 },
};

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

/* ---------------- utils ---------------- */

const toNum = (v) => {
  if (v == null) return null;
  const s = String(v).replace(/[¥￥,\s%]/g, '');
  if (s === '' || s === '-' || s === '—') return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
};

const fmtMoney = (n, decimals = 0) => {
  if (n == null || Number.isNaN(n)) return '—';
  const sign = n < 0 ? '-' : '';
  return sign + '¥' + Math.abs(n).toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const fmtSigned = (n, decimals = 0) => {
  if (n == null || Number.isNaN(n)) return '—';
  const sign = n > 0 ? '+' : n < 0 ? '-' : '';
  return sign + '¥' + Math.abs(n).toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

const fmtPct = (n, digits = 1) => {
  if (n == null || !Number.isFinite(n)) return '—';
  const sign = n > 0 ? '+' : '';
  return sign + (n * 100).toFixed(digits) + '%';
};

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('is-show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('is-show'), 2200);
}

/* ---------------- CSV ---------------- */

function detectDelimiter(line) {
  const candidates = [',', '\t', ';', '|'];
  let best = ',';
  let bestCount = -1;
  candidates.forEach((d) => {
    const count = line.split(d).length - 1;
    if (count > bestCount) { bestCount = count; best = d; }
  });
  return best;
}

function parseTable(text) {
  const clean = String(text).replace(/^\uFEFF/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();
  if (!clean) throw new Error('文件内容为空');

  const delimiter = detectDelimiter(clean.split('\n')[0]);
  const rows = [];
  let row = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i += 1) {
    const ch = clean[i];
    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') { field += '"'; i += 1; } else { inQuotes = false; }
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delimiter) {
      row.push(field); field = '';
    } else if (ch === '\n') {
      row.push(field); rows.push(row); row = []; field = '';
    } else {
      field += ch;
    }
  }
  row.push(field);
  rows.push(row);

  const nonEmpty = rows.filter((r) => r.some((c) => String(c).trim() !== ''));
  if (nonEmpty.length < 2) throw new Error('至少需要表头 + 一行数据');

  const headers = nonEmpty[0].map((h) => String(h).trim());
  const body = nonEmpty.slice(1);
  return { headers, body };
}

const FIELD_RULES = [
  ['code', ['物料编码', '物料编号', '物料号', '料号', '产品编码', '编码', '编号', 'sku', 'item no', 'part no', 'code']],
  ['name', ['物料名称', '产品名称', '品名', '名称', '描述', '名称规格', 'name', 'description', 'desc']],
  ['spec', ['规格型号', '规格', '型号', 'spec']],
  ['unit', ['单位', '计量单位', 'unit']],
  ['price', ['含税单价', '未税单价', '单价', '价格', 'price', 'unit price']],
  ['qty', ['数量', '采购数量', 'qty', 'quantity']],
  ['amount', ['金额', '总价', '小计', 'amount', 'total']],
  ['lead', ['交期(天)', '交期（天）', '交货期', '货期', '交期', 'lead time', 'lead']],
];

function mapColumns(headers) {
  const lower = headers.map((h) => h.toLowerCase().replace(/\s+/g, ''));
  const mapping = {};
  FIELD_RULES.forEach(([field, keywords]) => {
    const idx = lower.findIndex((h) => keywords.some((k) => h.includes(k.replace(/\s+/g, '').toLowerCase())));
    if (idx >= 0 && mapping[field] == null) mapping[field] = idx;
  });
  return mapping;
}

function buildDataset(text, label) {
  const { headers, body } = parseTable(text);
  const mapping = mapColumns(headers);
  if (mapping.code == null) throw new Error('没有识别到「物料编码 / 料号」列，请检查表头');
  if (mapping.price == null) throw new Error('没有识别到「单价 / 价格」列，请检查表头');

  const pick = (cells, key) => (mapping[key] == null ? null : cells[mapping[key]]);
  const records = [];
  let skipped = 0;

  body.forEach((cells) => {
    const code = String(pick(cells, 'code') ?? '').trim();
    const price = toNum(pick(cells, 'price'));
    if (!code && !String(pick(cells, 'name') ?? '').trim()) { skipped += 1; return; }
    if (!code || price == null) { skipped += 1; return; }
    records.push({
      code,
      name: String(pick(cells, 'name') ?? '').trim() || code,
      spec: String(pick(cells, 'spec') ?? '').trim(),
      unit: String(pick(cells, 'unit') ?? '').trim(),
      price,
      qty: toNum(pick(cells, 'qty')),
      amount: toNum(pick(cells, 'amount')),
      lead: toNum(pick(cells, 'lead')),
    });
  });

  if (!records.length) throw new Error('没有解析出有效数据行，请检查编码与单价两列');

  return {
    label,
    records,
    headers,
    mapping,
    skipped,
    mappingLabels: Object.keys(mapping).filter((k) => mapping[k] != null),
  };
}

/* ---------------- compare ---------------- */

const STATUS_TEXT = {
  up: '涨价', down: '降价', flat: '持平', new: '新增', missing: '漏报',
};

function compare(a, b) {
  const aMap = new Map();
  const dupCodes = new Set();
  a.records.forEach((r) => {
    if (aMap.has(r.code)) dupCodes.add(r.code);
    else aMap.set(r.code, r);
  });

  const bCodes = new Set(b.records.map((r) => r.code));
  const items = [];

  b.records.forEach((nb) => {
    const ob = aMap.get(nb.code);
    if (!ob) {
      items.push({
        code: nb.code, name: nb.name, unit: nb.unit,
        oldPrice: null, newPrice: nb.price,
        qty: nb.qty ?? 1, pct: null,
        impact: nb.price * (nb.qty ?? 1),
        status: 'new', flags: ['本期新增'],
      });
      return;
    }

    const qty = nb.qty ?? ob.qty ?? 1;
    const delta = nb.price - ob.price;
    const pct = ob.price === 0 ? null : delta / ob.price;
    const flags = [];

    if (pct != null && pct >= 0.3) flags.push('涨幅超 30%');
    else if (pct != null && pct >= 0.1) flags.push('涨幅超 10%');
    if (dupCodes.has(nb.code)) flags.push('编码重复');
    if (ob.unit && nb.unit && ob.unit !== nb.unit) flags.push(`单位不一致（${ob.unit}→${nb.unit}）`);
    if (ob.lead != null && nb.lead != null && nb.lead - ob.lead >= 7) {
      flags.push(`交期 +${Math.round(nb.lead - ob.lead)} 天`);
    }
    if (nb.amount != null && nb.qty != null) {
      const expect = nb.price * nb.qty;
      if (Math.abs(nb.amount - expect) > Math.max(0.02, Math.abs(nb.amount) * 0.005)) {
        flags.push('金额与单价×数量不符');
      }
    }

    items.push({
      code: nb.code,
      name: nb.name || ob.name,
      unit: nb.unit || ob.unit,
      oldPrice: ob.price,
      newPrice: nb.price,
      qty,
      pct,
      impact: delta * qty,
      status: Math.abs(delta) < 0.00001 ? 'flat' : (delta > 0 ? 'up' : 'down'),
      flags,
    });
  });

  a.records.forEach((oa) => {
    if (bCodes.has(oa.code)) return;
    items.push({
      code: oa.code, name: oa.name, unit: oa.unit,
      oldPrice: oa.price, newPrice: null,
      qty: oa.qty ?? 1, pct: null,
      impact: -(oa.price * (oa.qty ?? 1)),
      status: 'missing', flags: ['本期未报价'],
    });
  });

  const totalA = a.records.reduce((s, r) => s + r.price * (r.qty ?? 1), 0);
  const totalB = b.records.reduce((s, r) => s + r.price * (r.qty ?? 1), 0);

  const matched = items.filter((i) => i.status === 'up' || i.status === 'down' || i.status === 'flat');
  const matchedA = matched.reduce((s, i) => s + i.oldPrice * i.qty, 0);
  const matchedB = matched.reduce((s, i) => s + i.newPrice * i.qty, 0);

  const upItems = items.filter((i) => i.status === 'up');
  const downItems = items.filter((i) => i.status === 'down');
  const flatItems = items.filter((i) => i.status === 'flat');
  const newItems = items.filter((i) => i.status === 'new');
  const missingItems = items.filter((i) => i.status === 'missing');

  const negotiable = upItems
    .filter((i) => i.pct != null && i.pct >= 0.05)
    .reduce((s, i) => s + i.impact, 0);

  const missingValue = missingItems.reduce((s, i) => s + Math.abs(i.impact), 0);
  const newValue = newItems.reduce((s, i) => s + i.impact, 0);

  items.sort((x, y) => Math.abs(y.impact) - Math.abs(x.impact));

  return {
    items, totalA, totalB, matchedA, matchedB,
    upItems, downItems, flatItems, newItems, missingItems,
    negotiable, missingValue, newValue,
    riskItems: items.filter((i) => i.flags.length > 0),
  };
}

/* ---------------- render: import ---------------- */

function renderSide(side) {
  const ds = state[side];
  const zone = $(`#dz-${side}`);
  const empty = zone.querySelector('.dz-empty');
  const loaded = zone.querySelector('.dz-loaded');
  zone.classList.toggle('is-loaded', !!ds);

  if (!ds) {
    empty.hidden = false;
    loaded.hidden = true;
    return;
  }

  empty.hidden = true;
  loaded.hidden = false;
  loaded.querySelector('.dz-name').textContent = ds.label;
  loaded.querySelector('.dz-rows').textContent = `${ds.records.length} 行` + (ds.skipped ? ` · 跳过 ${ds.skipped}` : '');
  const cols = loaded.querySelector('.dz-cols');
  const labelMap = {
    code: '编码', name: '名称', spec: '规格', unit: '单位',
    price: '单价', qty: '数量', amount: '金额', lead: '交期',
  };
  cols.innerHTML = ds.mappingLabels.map((k) => `<span>${labelMap[k] || k}</span>`).join('');
}

function updateRunState() {
  const ready = !!(state.a && state.b);
  $('#runBtn').disabled = !ready;
  $('#runHint').textContent = ready
    ? `已就绪：A ${state.a.records.length} 项 · B ${state.b.records.length} 项，点击开始比对`
    : '先载入两份报价，按钮才会亮起';

  const status = $('#importStatus');
  status.classList.toggle('is-ready', ready);
  status.classList.remove('is-error');
  $('#statusText').textContent = ready
    ? '两份报价已载入，数据只在本地解析，不会上传'
    : '还没有导入数据，点上方「一键载入示例数据」可直接体验';
}

function setError(msg) {
  const status = $('#importStatus');
  status.classList.remove('is-ready');
  status.classList.add('is-error');
  $('#statusText').textContent = msg;
  toast(msg);
}

/* ---------------- render: results ---------------- */

function renderAll(options = {}) {
  const r = state.result;
  if (!r) return;

  renderInsight(r);
  renderKpi(r);
  renderFilters(r);
  renderTable();
  renderChart(r);
  renderAdvice(r);

  const box = $('#results');
  box.hidden = false;
  box.style.animation = 'none';
  void box.offsetWidth;
  box.style.animation = '';
  if (options.scroll !== false) {
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function renderInsight(r) {
  const diff = r.totalB - r.totalA;
  const pct = r.totalA ? diff / r.totalA : 0;
  const matchedDiff = r.matchedB - r.matchedA;
  const matchedPct = r.matchedA ? matchedDiff / r.matchedA : 0;
  const topUp = r.upItems.slice().sort((x, y) => y.impact - x.impact).slice(0, 3);

  const el = $('#insight');
  const good = diff <= 0;
  el.classList.toggle('is-good', good);

  const head = good
    ? `本期总价 <b>${fmtMoney(r.totalB)}</b>，比基准 <b>${fmtMoney(r.totalA)}</b> 低了 <span class="em-good">${fmtMoney(Math.abs(diff))}</span>（${fmtPct(pct)}）。`
    : `本期总价 <b>${fmtMoney(r.totalB)}</b>，比基准 <b>${fmtMoney(r.totalA)}</b> 多了 <span class="em-up">${fmtMoney(diff)}</span>（${fmtPct(pct)}）。`;

  let body = '';
  if (r.missingItems.length && diff > 0) {
    body = `注意：这个涨幅被 <b>${r.missingItems.length} 项漏报</b>（合计 ${fmtMoney(r.missingValue)}）压低了；只看双方都报价的 ${r.matchedA ? r.items.filter((i) => i.status !== 'new' && i.status !== 'missing').length : 0} 项，实际变化是 ${fmtSigned(matchedDiff)}（${fmtPct(matchedPct)}）。`;
  } else if (topUp.length) {
    body = `涨幅最大的三项是 ${topUp.map((i) => `${esc(i.name)}（${fmtSigned(i.impact)}）`).join('、')}。`;
  }

  const icon = `<svg class="insight-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 8v5m0 3.2v.2M12 3.5 21.2 20H2.8L12 3.5Z" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  el.innerHTML = `${icon}<div>${head}${body ? ' ' + body : ''}</div>`;
}

function renderKpi(r) {
  const diff = r.totalB - r.totalA;
  const pct = r.totalA ? diff / r.totalA : 0;

  const cards = [
    {
      label: '本期总价',
      value: fmtMoney(r.totalB),
      sub: `基准 ${fmtMoney(r.totalA)}`,
      cls: '',
    },
    {
      label: '总价变化',
      value: fmtSigned(diff),
      sub: fmtPct(pct) + ' 对基准',
      cls: diff > 0 ? 'up' : diff < 0 ? 'down' : '',
    },
    {
      label: '涨价项',
      value: String(r.upItems.length),
      sub: `降价 ${r.downItems.length} · 持平 ${r.flatItems.length}`,
      cls: r.upItems.length ? 'warn' : '',
    },
    {
      label: '漏报 / 新增',
      value: `${r.missingItems.length} / ${r.newItems.length}`,
      sub: r.missingItems.length ? `漏报金额 ${fmtMoney(r.missingValue)}` : '无漏报',
      cls: r.missingItems.length ? 'warn' : '',
    },
    {
      label: '预计可谈金额',
      value: fmtMoney(r.negotiable),
      sub: '涨幅≥5% 按回到 A 价测算',
      cls: 'down',
    },
  ];

  $('#kpiGrid').innerHTML = cards.map((c) => `
    <div class="kpi">
      <div class="kpi-label">${c.label}</div>
      <div class="kpi-value ${c.cls}">${c.value}</div>
      <div class="kpi-sub">${c.sub}</div>
    </div>
  `).join('');
}

function renderFilters(r) {
  const counts = {
    all: r.items.length,
    up: r.upItems.length,
    down: r.downItems.length,
    new: r.newItems.length,
    missing: r.missingItems.length,
    risk: r.riskItems.length,
  };
  $$('#filters .filter').forEach((btn) => {
    const key = btn.dataset.filter;
    btn.querySelector('b').textContent = counts[key] ?? 0;
    btn.classList.toggle('is-active', key === state.filter);
  });
}

function filteredItems() {
  const r = state.result;
  if (!r) return [];
  const map = {
    all: r.items,
    up: r.upItems,
    down: r.downItems,
    new: r.newItems,
    missing: r.missingItems,
    risk: r.riskItems,
  };
  const list = (map[state.filter] || r.items).slice();
  const { key, dir } = state.sort;
  list.sort((x, y) => {
    const vx = key === 'impact' ? x.impact : (x.pct ?? -Infinity);
    const vy = key === 'impact' ? y.impact : (y.pct ?? -Infinity);
    return (vx - vy) * dir;
  });
  return list;
}

function renderTable() {
  const list = filteredItems();
  const body = $('#diffBody');
  $('#tableEmpty').hidden = list.length > 0;

  body.innerHTML = list.map((i) => {
    const statusClass = `badge-${i.status === 'flat' ? 'flat' : i.status}`;
    const delta = i.oldPrice != null && i.newPrice != null ? i.newPrice - i.oldPrice : null;
    const impactCls = i.status === 'missing' ? 't-muted'
      : i.status === 'new' ? '' : (i.impact > 0 ? 'up-num' : i.impact < 0 ? 'down-num' : 't-muted');

    const tags = i.flags.map((f) => {
      const risk = f.includes('超 30') || f.includes('不符');
      return `<span class="tag ${risk ? 'tag-risk' : ''}">${esc(f)}</span>`;
    }).join('');

    return `
      <tr>
        <td><span class="badge ${statusClass}">${STATUS_TEXT[i.status]}</span></td>
        <td class="t-code">${esc(i.code)}</td>
        <td class="t-name">${esc(i.name)}</td>
        <td class="t-muted">${esc(i.unit || '—')}</td>
        <td class="num">${i.oldPrice == null ? '—' : fmtMoney(i.oldPrice, 2)}</td>
        <td class="num">${i.newPrice == null ? '—' : fmtMoney(i.newPrice, 2)}</td>
        <td class="num ${delta == null ? 't-muted' : delta > 0 ? 'up-num' : delta < 0 ? 'down-num' : 't-muted'}">${delta == null ? '—' : fmtSigned(delta, 2)}</td>
        <td class="num ${i.pct == null ? 't-muted' : i.pct > 0 ? 'up-num' : i.pct < 0 ? 'down-num' : 't-muted'}">${i.pct == null ? '—' : fmtPct(i.pct)}</td>
        <td class="num">${i.qty}</td>
        <td class="num ${impactCls}">${fmtSigned(i.impact)}</td>
        <td>${tags || '<span class="t-muted">—</span>'}</td>
      </tr>
    `;
  }).join('');
}

function renderChart(r) {
  const list = r.items
    .filter((i) => i.status === 'up' || i.status === 'down')
    .filter((i) => Math.abs(i.impact) > 0.0001)
    .sort((x, y) => Math.abs(y.impact) - Math.abs(x.impact))
    .slice(0, 10);

  if (!list.length) {
    $('#chart').innerHTML = '<p class="table-empty">没有价格变动，无法绘制</p>';
    return;
  }

  const max = Math.max(...list.map((i) => Math.abs(i.impact)));

  $('#chart').innerHTML = list.map((i) => {
    const width = Math.max(2, (Math.abs(i.impact) / max) * 100);
    const cls = i.impact > 0 ? 'up' : 'down';
    return `
      <div class="bar-row">
        <div class="bar-label" title="${esc(i.name)}">${esc(i.name)}</div>
        <div class="bar-track"><div class="bar-fill ${cls}" style="width:${width}%"></div></div>
        <div class="bar-value ${cls === 'up' ? 'up-num' : 'down-num'}">${fmtSigned(i.impact)}</div>
      </div>
    `;
  }).join('');
}

function adviceFor(item) {
  if (item.status === 'new') {
    return '本期新增项：要求提供完整报价明细与同类物料对标价，确认规格无替换后再纳入，避免以低价项掩护整体涨价。';
  }
  if (item.status === 'missing') {
    return '本期未报价：先确认是停产、改型还是遗漏。若为遗漏，要求按上期价补报；若借机替换为高价款，应直接退回。';
  }
  if (item.pct != null && item.pct >= 0.2) {
    return `涨幅 ${fmtPct(item.pct)}，已超出常规调价区间。要求供应商提供原材料或汇率依据，同步启动二供询价，谈回上期价 ${fmtMoney(item.oldPrice, 2)}。`;
  }
  if (item.pct != null && item.pct >= 0.1) {
    return `涨幅 ${fmtPct(item.pct)}，高于同批物料平均涨幅。建议以同批其他物料为锚，要求压到 +5% 以内，差额约 ${fmtMoney(item.impact * 0.5)}。`;
  }
  return `涨幅 ${fmtPct(item.pct)}，可接受。可用采购量或账期换价，争取抹零，或要求锁定下季度价格。`;
}

function renderAdvice(r) {
  const pool = r.upItems.slice().sort((x, y) => y.impact - x.impact).slice(0, 5);
  const el = $('#adviceList');

  if (!pool.length) {
    el.innerHTML = '<p class="table-empty">本期没有涨价项，可重点核对漏报与新增</p>';
    return;
  }

  el.innerHTML = pool.map((i, idx) => `
    <div class="advice">
      <div class="advice-rank">${String(idx + 1).padStart(2, '0')}</div>
      <div>
        <div class="advice-title">${esc(i.name)}<span>${esc(i.code)} · ${fmtMoney(i.oldPrice, 2)} → ${fmtMoney(i.newPrice, 2)}</span></div>
        <p class="advice-text">${adviceFor(i)}</p>
      </div>
      <div class="advice-money">${fmtSigned(i.impact)}<small>影响金额</small></div>
    </div>
  `).join('');
}

/* ---------------- export ---------------- */

function exportCsv() {
  const r = state.result;
  if (!r) return;
  const head = ['状态', '物料编码', '物料名称', '单位', 'A价', 'B价', '变动', '变动率', '数量', '影响金额', '标记'];
  const lines = [head.join(',')];

  r.items.forEach((i) => {
    const delta = i.oldPrice != null && i.newPrice != null ? (i.newPrice - i.oldPrice).toFixed(2) : '';
    const row = [
      STATUS_TEXT[i.status],
      i.code,
      `"${String(i.name).replace(/"/g, '""')}"`,
      i.unit || '',
      i.oldPrice == null ? '' : i.oldPrice.toFixed(2),
      i.newPrice == null ? '' : i.newPrice.toFixed(2),
      delta,
      i.pct == null ? '' : (i.pct * 100).toFixed(1) + '%',
      i.qty,
      i.impact.toFixed(2),
      `"${i.flags.join(' / ')}"`,
    ];
    lines.push(row.join(','));
  });

  download('\uFEFF' + lines.join('\n'), '报价比对结果.csv', 'text/csv;charset=utf-8');
  toast('已导出 CSV');
}

function buildMarkdown() {
  const r = state.result;
  const diff = r.totalB - r.totalA;
  const pct = r.totalA ? diff / r.totalA : 0;
  const top = r.upItems.slice().sort((x, y) => y.impact - x.impact).slice(0, 5);

  const lines = [
    '# 报价比对报告',
    '',
    `生成时间：${new Date().toLocaleString('zh-CN')}`,
    '',
    '## 总览',
    '',
    `- 基准总价：${fmtMoney(r.totalA)}`,
    `- 本期总价：${fmtMoney(r.totalB)}`,
    `- 变化：${fmtSigned(diff)}（${fmtPct(pct)}）`,
    `- 涨价项：${r.upItems.length}　降价项：${r.downItems.length}　持平：${r.flatItems.length}`,
    `- 漏报：${r.missingItems.length}（${fmtMoney(r.missingValue)}）　新增：${r.newItems.length}（${fmtMoney(r.newValue)}）`,
    `- 预计可谈金额：${fmtMoney(r.negotiable)}`,
    '',
    '## 议价重点',
    '',
  ];

  top.forEach((i, idx) => {
    lines.push(`### ${idx + 1}. ${i.name}（${i.code}）`);
    lines.push('');
    lines.push(`- 价格：${fmtMoney(i.oldPrice, 2)} → ${fmtMoney(i.newPrice, 2)}（${fmtPct(i.pct)}）`);
    lines.push(`- 影响金额：${fmtSigned(i.impact)}`);
    lines.push(`- 建议：${adviceFor(i)}`);
    lines.push('');
  });

  if (r.missingItems.length) {
    lines.push('## 漏报项');
    lines.push('');
    r.missingItems.forEach((i) => lines.push(`- ${i.name}（${i.code}）：上期 ${fmtMoney(i.oldPrice, 2)} × ${i.qty}`));
    lines.push('');
  }

  if (r.newItems.length) {
    lines.push('## 新增项');
    lines.push('');
    r.newItems.forEach((i) => lines.push(`- ${i.name}（${i.code}）：${fmtMoney(i.newPrice, 2)} × ${i.qty} = ${fmtMoney(i.impact)}`));
    lines.push('');
  }

  lines.push('> 口径：影响金额 =（B 价 − A 价）× 数量；预计可谈金额按涨幅≥5% 的条目回到 A 价测算，为理论上限。');
  return lines.join('\n');
}

function exportMarkdown() {
  if (!state.result) return;
  download(buildMarkdown(), '报价比对报告.md', 'text/markdown;charset=utf-8');
  toast('已导出 Markdown 报告');
}

async function copyList() {
  const r = state.result;
  if (!r) return;
  const top = r.upItems.slice().sort((x, y) => y.impact - x.impact).slice(0, 5);
  if (!top.length) { toast('本期没有涨价项'); return; }

  const text = [
    '【本期议价清单】',
    ...top.map((i, idx) => `${idx + 1}. ${i.name}（${i.code}）：${fmtMoney(i.oldPrice, 2)} → ${fmtMoney(i.newPrice, 2)}，涨 ${fmtPct(i.pct)}，影响 ${fmtSigned(i.impact)}。${adviceFor(i)}`),
    `合计可谈：${fmtMoney(r.negotiable)}`,
  ].join('\n');

  try {
    await navigator.clipboard.writeText(text);
    toast('议价清单已复制，可直接粘贴到聊天窗口');
  } catch (e) {
    toast('复制失败，请改用「导出报告」');
  }
}

function download(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/* ---------------- file input ---------------- */

async function readFile(file) {
  const buffer = await file.arrayBuffer();
  let text = new TextDecoder('utf-8').decode(buffer);
  if (text.includes('\uFFFD')) {
    try { text = new TextDecoder('gbk').decode(buffer); } catch (e) { /* 保持 utf-8 结果 */ }
  }
  return text;
}

function loadDataset(side, text, label) {
  try {
    state[side] = buildDataset(text, label);
    renderSide(side);
    updateRunState();
    return true;
  } catch (err) {
    setError(`导入失败：${err.message}`);
    return false;
  }
}

function loadSample(side) {
  const text = side === 'a' ? SAMPLE_A : SAMPLE_B;
  const label = side === 'a' ? '示例 · 2026Q3 基准报价.csv' : '示例 · 2026Q4 本期报价.csv';
  loadDataset(side, text, label);
}

function resetSide(side) {
  state[side] = null;
  state.result = null;
  $('#results').hidden = true;
  renderSide(side);
  updateRunState();
}

function wireDropzone(side) {
  const zone = $(`#dz-${side}`);

  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.classList.add('is-drag');
  });
  zone.addEventListener('dragleave', () => zone.classList.remove('is-drag'));
  zone.addEventListener('drop', async (e) => {
    e.preventDefault();
    zone.classList.remove('is-drag');
    const file = e.dataTransfer.files && e.dataTransfer.files[0];
    if (!file) return;
    const text = await readFile(file);
    loadDataset(side, text, file.name);
  });

  const input = zone.querySelector(`input[data-file="${side}"]`);
  input.addEventListener('change', async () => {
    const file = input.files && input.files[0];
    if (!file) return;
    const text = await readFile(file);
    loadDataset(side, text, file.name);
    input.value = '';
  });

  zone.querySelectorAll(`[data-sample="${side}"]`).forEach((btn) => {
    btn.addEventListener('click', () => loadSample(side));
  });
  zone.querySelectorAll(`[data-reset="${side}"]`).forEach((btn) => {
    btn.addEventListener('click', () => resetSide(side));
  });
}

/* ---------------- init ---------------- */

function init() {
  wireDropzone('a');
  wireDropzone('b');

  $('#loadSampleBtn').addEventListener('click', () => {
    loadSample('a');
    loadSample('b');
    toast('已载入两份示例报价，点击「开始比对」试试');
  });

  $('#runBtn').addEventListener('click', () => {
    if (!state.a || !state.b) return;
    state.result = compare(state.a, state.b);
    state.filter = 'all';
    state.sort = { key: 'impact', dir: -1 };
    renderAll();
  });

  $('#filters').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter');
    if (!btn) return;
    state.filter = btn.dataset.filter;
    renderFilters(state.result);
    renderTable();
  });

  document.querySelectorAll('th.sortable').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      if (state.sort.key === key) state.sort.dir *= -1;
      else state.sort = { key, dir: -1 };
      document.querySelectorAll('th.sortable').forEach((el) => el.classList.remove('is-sorted'));
      th.classList.add('is-sorted');
      renderTable();
    });
  });

  $('#exportCsvBtn').addEventListener('click', exportCsv);
  $('#exportMdBtn').addEventListener('click', exportMarkdown);
  $('#copyBtn').addEventListener('click', copyList);

  const params = new URLSearchParams(location.search);
  if (params.get('demo') === '1') {
    loadSample('a');
    loadSample('b');
    if (state.a && state.b) {
      state.result = compare(state.a, state.b);
      renderAll({ scroll: false });
    }
  }
}

document.addEventListener('DOMContentLoaded', init);
