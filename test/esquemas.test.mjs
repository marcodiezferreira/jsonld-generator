// node --test
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ESQUEMAS, construir, etiqueta, revisar, valoresIniciales } from '../src/esquemas.js';

test('negocio local completo con dirección, geo, horario y zonas', () => {
  const v = { ...valoresIniciales('negocio'), subtipo: 'Plumber', name: 'Fontanería Pérez', telephone: '+34 600 000 000',
    streetAddress: 'Calle Mayor 1', addressLocality: 'Córdoba', postalCode: '14001', latitude: '37,88', longitude: '-4.78',
    openingHours: 'Mo-Fr 09:00-14:00\nSa 10:00-13:00', areaServed: 'Córdoba\nLucena', sameAs: 'https://instagram.com/x\n' };
  const o = construir('negocio', v);
  assert.equal(o['@context'], 'https://schema.org');
  assert.equal(o['@type'], 'Plumber');
  assert.deepEqual(o.address, { '@type': 'PostalAddress', streetAddress: 'Calle Mayor 1', postalCode: '14001', addressLocality: 'Córdoba', addressCountry: 'ES' });
  assert.deepEqual(o.geo, { '@type': 'GeoCoordinates', latitude: 37.88, longitude: -4.78 });
  assert.deepEqual(o.openingHours, ['Mo-Fr 09:00-14:00', 'Sa 10:00-13:00']);
  assert.equal(o.areaServed.length, 2);
  assert.deepEqual(o.sameAs, ['https://instagram.com/x']);
  assert.equal('email' in o, false); // los vacíos no aparecen
});

test('revisar: obligatorios, formatos y recomendados', () => {
  const r = revisar('negocio', { ...valoresIniciales('negocio'), name: 'X', url: 'web.com', openingHours: 'lunes 9 a 2' });
  assert.ok(r.errores.some(e => e.includes('Calle y número')));
  assert.ok(r.errores.some(e => e.includes('dirección completa')));
  assert.ok(r.avisos.some(a => a.includes('horario')));
  assert.ok(r.avisos.some(a => a.includes('Teléfono')));
});

test('FAQ: solo pares completos', () => {
  const o = construir('faq', { preguntas: [{ q: '¿Abrís en agosto?', a: 'Sí, de 9 a 14.' }, { q: 'Sin respuesta', a: '' }] });
  assert.equal(o['@type'], 'FAQPage');
  assert.equal(o.mainEntity.length, 1);
  assert.equal(o.mainEntity[0].acceptedAnswer.text, 'Sí, de 9 a 14.');
  assert.ok(revisar('faq', { preguntas: [{ q: '', a: '' }] }).errores.length);
});

test('artículo con autor y editor anidados', () => {
  const o = construir('articulo', { ...valoresIniciales('articulo'), headline: 'Título', datePublished: '2026-10-19', author: 'Ana', publisher: 'Mi Web', publisherLogo: 'https://w.com/logo.png' });
  assert.equal(o['@type'], 'BlogPosting');
  assert.equal(o.dateModified, '2026-10-19');
  assert.deepEqual(o.author, { '@type': 'Person', name: 'Ana' });
  assert.equal(o.publisher.logo.url, 'https://w.com/logo.png');
});

test('etiqueta escapa < para no romper el script', () => {
  const t = etiqueta(construir('persona', { ...valoresIniciales('persona'), name: 'A </script> B' }));
  assert.ok(t.startsWith('<script type="application/ld+json">'));
  assert.ok(!t.slice(30, -10).includes('</script>'));
});

test('todos los tipos construyen con sus valores iniciales sin fallar', () => {
  for (const id of Object.keys(ESQUEMAS)) assert.ok(construir(id, valoresIniciales(id))['@type']);
});
