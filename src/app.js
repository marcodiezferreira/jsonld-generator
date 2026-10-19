// Interfaz de jsonld-generator. La lógica (campos, revisión y construcción) está en esquemas.js.
import { ESQUEMAS, construir, etiqueta, revisar, valoresIniciales } from './esquemas.js';

const $ = id => document.getElementById(id);
const CLAVE = 'jsonld-generator:datos';
const el = (etiq, props = {}, ...hijos) => { const n = Object.assign(document.createElement(etiq), props); n.append(...hijos); return n; };

// Almacenamiento local con red de seguridad (navegación privada, almacenamiento bloqueado…).
const leer = () => { try { return JSON.parse(localStorage.getItem(CLAVE)) ?? {}; } catch { return {}; } };
const escribir = v => { try { localStorage.setItem(CLAVE, JSON.stringify(v)); } catch { /* sin almacenamiento */ } };

const guardado = leer();
let tipo = ESQUEMAS[guardado.tipo] ? guardado.tipo : 'negocio';
const datos = Object.fromEntries(Object.keys(ESQUEMAS).map(id => [id, { ...valoresIniciales(id), ...(guardado.datos?.[id] || {}) }]));
let codigo = '';

function campo(c, v) {
  const id = `c-${c.clave}`;
  const marca = c.requerido ? el('span', { className: 'marca', textContent: ' *' }) : c.recomendado ? el('span', { className: 'marca rec', textContent: ' recomendado' }) : '';
  const etiq = el('label', { htmlFor: id }, c.etiqueta, marca);
  let entrada;
  if (c.tipo === 'select') {
    entrada = el('select', { id }, ...c.opciones.map(([valor, texto]) => el('option', { value: valor, textContent: texto })));
  } else if (c.tipo === 'textarea') {
    entrada = el('textarea', { id, rows: 3 });
  } else {
    // Los números van en un campo de texto para aceptar la coma decimal (37,88).
    entrada = el('input', { id, type: c.tipo === 'number' ? 'text' : (c.tipo || 'text') });
    if (c.tipo === 'number') entrada.inputMode = 'decimal';
    if (c.tipo === 'url') entrada.placeholder = 'https://';
  }
  entrada.value = v[c.clave] ?? '';
  entrada.addEventListener('input', () => { v[c.clave] = entrada.value; actualizar(); });
  return el('div', {}, etiq, entrada);
}

function bloqueFAQ(c, v) {
  const caja = el('div', {});
  const pintar = () => {
    caja.replaceChildren(...v[c.clave].map((par, i) => {
      const q = el('input', { id: `faq-q-${i}`, value: par.q, placeholder: '¿Hacéis presupuestos sin compromiso?' });
      const a = el('textarea', { id: `faq-a-${i}`, rows: 3, value: par.a, placeholder: 'Sí, en 24 horas y gratis.' });
      q.addEventListener('input', () => { par.q = q.value; actualizar(); });
      a.addEventListener('input', () => { par.a = a.value; actualizar(); });
      const quitar = el('button', { type: 'button', className: 'peligro', textContent: 'Quitar', disabled: v[c.clave].length === 1 });
      quitar.addEventListener('click', () => { v[c.clave].splice(i, 1); pintar(); actualizar(); });
      return el('div', { className: 'faq-par' }, el('label', { htmlFor: q.id, textContent: `Pregunta ${i + 1}` }), q,
        el('label', { htmlFor: a.id, textContent: 'Respuesta' }), a, el('div', { className: 'acciones' }, quitar));
    }));
  };
  pintar();
  const mas = el('button', { type: 'button', className: 'secundario', textContent: 'Añadir pregunta' });
  mas.addEventListener('click', () => { v[c.clave].push({ q: '', a: '' }); pintar(); actualizar(); caja.lastElementChild?.querySelector('input')?.focus(); });
  return el('div', {}, caja, el('div', { className: 'acciones' }, mas));
}

function pintarFormulario() {
  const esq = ESQUEMAS[tipo], v = datos[tipo];
  $('ayuda-tipo').textContent = esq.ayuda;
  $('formulario').replaceChildren(...esq.campos.map(c => (c.tipo === 'faq' ? bloqueFAQ(c, v) : campo(c, v))));
  for (const b of $('tipos').children) b.setAttribute('aria-pressed', String(b.dataset.tipo === tipo));
}

function actualizar() {
  const { errores, avisos } = revisar(tipo, datos[tipo]);
  $('mensajes').replaceChildren(...errores.map(t => el('li', { className: 'error', textContent: t })),
    ...avisos.map(t => el('li', { className: 'aviso', textContent: t })));
  codigo = etiqueta(construir(tipo, datos[tipo]));
  $('codigo').textContent = codigo;
  $('copiar').textContent = errores.length ? 'Copiar (le faltan datos)' : 'Copiar código';
  escribir({ tipo, datos });
}

$('tipos').append(...Object.entries(ESQUEMAS).map(([id, esq]) => {
  const b = el('button', { type: 'button', textContent: esq.nombre });
  b.dataset.tipo = id;
  b.addEventListener('click', () => { tipo = id; pintarFormulario(); actualizar(); });
  return b;
}));

$('copiar').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(codigo); } catch {
    const r = document.createRange(); r.selectNodeContents($('codigo'));
    getSelection().removeAllRanges(); getSelection().addRange(r); document.execCommand('copy');
  }
  const b = $('copiar'), antes = b.textContent;
  b.textContent = '¡Copiado!'; setTimeout(() => { b.textContent = antes; }, 1500);
});

$('descargar').addEventListener('click', () => {
  const json = JSON.stringify(construir(tipo, datos[tipo]), null, 2);
  const url = URL.createObjectURL(new Blob([json], { type: 'application/ld+json' }));
  const a = el('a', { href: url, download: `${tipo}.jsonld.json` });
  document.body.append(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

$('limpiar').addEventListener('click', () => {
  if (!confirm('¿Vaciar todos los campos de este tipo?')) return;
  datos[tipo] = valoresIniciales(tipo); pintarFormulario(); actualizar();
});

pintarFormulario();
actualizar();
