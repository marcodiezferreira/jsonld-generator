// Tipos de datos estructurados, sus campos y cómo se construye el JSON-LD (sin DOM: se prueba con node --test).
// «requerido» y «recomendado» siguen la documentación de datos estructurados de Google Search para cada tipo.

const lineas = v => String(v || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
const limpio = v => String(v ?? '').trim();

export const SUBTIPOS_NEGOCIO = [
  ['LocalBusiness', 'Negocio local (genérico)'], ['ProfessionalService', 'Servicios profesionales'], ['Restaurant', 'Restaurante'],
  ['CafeOrCoffeeShop', 'Cafetería'], ['Store', 'Tienda'], ['BeautySalon', 'Centro de estética / peluquería'], ['Dentist', 'Clínica dental'],
  ['MedicalClinic', 'Clínica médica'], ['LegalService', 'Asesoría legal'], ['AccountingService', 'Gestoría / contabilidad'],
  ['RealEstateAgent', 'Inmobiliaria'], ['HomeAndConstructionBusiness', 'Reformas y construcción'], ['Plumber', 'Fontanería'],
  ['Electrician', 'Electricista'], ['AutoRepair', 'Taller mecánico'], ['SportsActivityLocation', 'Gimnasio / deporte'], ['LodgingBusiness', 'Alojamiento'],
];

export const ESQUEMAS = {
  negocio: {
    nombre: 'Negocio local', ayuda: 'Para aparecer bien en Google y en Maps: dirección, horario, teléfono y área de servicio.',
    campos: [
      { clave: 'subtipo', etiqueta: 'Tipo de negocio', tipo: 'select', opciones: SUBTIPOS_NEGOCIO, requerido: true },
      { clave: 'name', etiqueta: 'Nombre', requerido: true },
      { clave: 'description', etiqueta: 'Descripción', tipo: 'textarea' },
      { clave: 'url', etiqueta: 'Web', tipo: 'url', recomendado: true },
      { clave: 'telephone', etiqueta: 'Teléfono (con prefijo, +34…)', tipo: 'tel', recomendado: true },
      { clave: 'email', etiqueta: 'Email', tipo: 'email' },
      { clave: 'image', etiqueta: 'Imagen o logo (URL)', tipo: 'url', recomendado: true },
      { clave: 'streetAddress', etiqueta: 'Calle y número', requerido: true },
      { clave: 'postalCode', etiqueta: 'Código postal', recomendado: true },
      { clave: 'addressLocality', etiqueta: 'Ciudad', requerido: true },
      { clave: 'addressRegion', etiqueta: 'Provincia' },
      { clave: 'addressCountry', etiqueta: 'País (código)', defecto: 'ES', recomendado: true },
      { clave: 'latitude', etiqueta: 'Latitud', tipo: 'number', recomendado: true },
      { clave: 'longitude', etiqueta: 'Longitud', tipo: 'number', recomendado: true },
      { clave: 'openingHours', etiqueta: 'Horario (una línea por tramo: Mo-Fr 09:00-14:00)', tipo: 'textarea', recomendado: true },
      { clave: 'priceRange', etiqueta: 'Rango de precios (€, €€, €€€)' },
      { clave: 'areaServed', etiqueta: 'Zonas donde trabajas (una por línea)', tipo: 'textarea' },
      { clave: 'sameAs', etiqueta: 'Perfiles (Google, Instagram, Facebook…), uno por línea', tipo: 'textarea', recomendado: true },
    ],
  },
  organizacion: {
    nombre: 'Organización / empresa', ayuda: 'Identidad de la empresa: logo, contacto y perfiles. Va en la portada.',
    campos: [
      { clave: 'name', etiqueta: 'Nombre', requerido: true },
      { clave: 'legalName', etiqueta: 'Razón social' },
      { clave: 'url', etiqueta: 'Web', tipo: 'url', requerido: true },
      { clave: 'logo', etiqueta: 'Logo (URL, mínimo 112×112 px)', tipo: 'url', recomendado: true },
      { clave: 'description', etiqueta: 'Descripción', tipo: 'textarea' },
      { clave: 'email', etiqueta: 'Email', tipo: 'email' },
      { clave: 'telephone', etiqueta: 'Teléfono', tipo: 'tel' },
      { clave: 'foundingDate', etiqueta: 'Fecha de fundación', tipo: 'date' },
      { clave: 'vatID', etiqueta: 'NIF / CIF' },
      { clave: 'sameAs', etiqueta: 'Perfiles (LinkedIn, Instagram…), uno por línea', tipo: 'textarea', recomendado: true },
    ],
  },
  persona: {
    nombre: 'Persona', ayuda: 'Para tu web personal o la ficha de un autor: quién eres, a qué te dedicas y tus perfiles.',
    campos: [
      { clave: 'name', etiqueta: 'Nombre', requerido: true },
      { clave: 'jobTitle', etiqueta: 'Profesión o puesto', recomendado: true },
      { clave: 'description', etiqueta: 'Descripción', tipo: 'textarea' },
      { clave: 'url', etiqueta: 'Web', tipo: 'url', recomendado: true },
      { clave: 'image', etiqueta: 'Foto (URL)', tipo: 'url', recomendado: true },
      { clave: 'worksFor', etiqueta: 'Empresa donde trabaja' },
      { clave: 'addressLocality', etiqueta: 'Ciudad' },
      { clave: 'knowsAbout', etiqueta: 'Temas en los que es experto (uno por línea)', tipo: 'textarea' },
      { clave: 'sameAs', etiqueta: 'Perfiles (LinkedIn, GitHub, X…), uno por línea', tipo: 'textarea', recomendado: true },
    ],
  },
  faq: {
    nombre: 'Preguntas frecuentes', ayuda: 'Las preguntas y respuestas tienen que verse también en la página, con el mismo texto.',
    campos: [
      { clave: 'preguntas', etiqueta: 'Preguntas y respuestas', tipo: 'faq', requerido: true },
    ],
  },
  articulo: {
    nombre: 'Artículo / post', ayuda: 'Para cada artículo del blog o noticia: título, autor, fechas e imagen.',
    campos: [
      { clave: 'subtipo', etiqueta: 'Tipo', tipo: 'select', opciones: [['BlogPosting', 'Post de blog'], ['Article', 'Artículo'], ['NewsArticle', 'Noticia']], requerido: true },
      { clave: 'headline', etiqueta: 'Título (máx. 110 caracteres)', requerido: true },
      { clave: 'description', etiqueta: 'Resumen', tipo: 'textarea' },
      { clave: 'url', etiqueta: 'URL del artículo', tipo: 'url', recomendado: true },
      { clave: 'image', etiqueta: 'Imagen principal (URL, 1200 px de ancho o más)', tipo: 'url', recomendado: true },
      { clave: 'datePublished', etiqueta: 'Fecha de publicación', tipo: 'date', recomendado: true },
      { clave: 'dateModified', etiqueta: 'Fecha de actualización', tipo: 'date' },
      { clave: 'author', etiqueta: 'Autor', recomendado: true },
      { clave: 'authorUrl', etiqueta: 'Web o perfil del autor', tipo: 'url' },
      { clave: 'publisher', etiqueta: 'Publicado por (web o empresa)' },
      { clave: 'publisherLogo', etiqueta: 'Logo de quien publica (URL)', tipo: 'url' },
    ],
  },
};

/** Valores iniciales de un tipo (con los defectos). */
export function valoresIniciales(id) {
  return Object.fromEntries(ESQUEMAS[id].campos.map(c => [c.clave, c.tipo === 'faq' ? [{ q: '', a: '' }] : (c.defecto ?? (c.tipo === 'select' ? c.opciones[0][0] : ''))]));
}

/** Errores (faltan obligatorios o formato incorrecto) y avisos (faltan recomendados). */
export function revisar(id, v) {
  const errores = [], avisos = [];
  for (const c of ESQUEMAS[id].campos) {
    if (c.tipo === 'faq') {
      const ok = (v[c.clave] || []).filter(p => limpio(p.q) && limpio(p.a));
      if (!ok.length) errores.push('Añade al menos una pregunta con su respuesta.');
      if ((v[c.clave] || []).some(p => (limpio(p.q) && !limpio(p.a)) || (!limpio(p.q) && limpio(p.a)))) avisos.push('Hay preguntas sin respuesta o respuestas sin pregunta: no se incluyen.');
      continue;
    }
    const valor = limpio(v[c.clave]);
    if (!valor) {
      if (c.requerido) errores.push(`Falta «${c.etiqueta}» (obligatorio).`);
      else if (c.recomendado) avisos.push(`Recomendado: «${c.etiqueta}».`);
      continue;
    }
    if (c.tipo === 'url' && !/^https?:\/\/\S+\.\S+/.test(valor)) errores.push(`«${c.etiqueta}» tiene que ser una dirección completa (https://…).`);
    if (c.tipo === 'email' && !/^\S+@\S+\.\S+$/.test(valor)) errores.push(`«${c.etiqueta}» no parece un email.`);
    if (c.tipo === 'number' && Number.isNaN(Number(valor.replace(',', '.')))) errores.push(`«${c.etiqueta}» tiene que ser un número.`);
  }
  if (id === 'articulo' && limpio(v.headline).length > 110) avisos.push('El título pasa de 110 caracteres: Google puede cortarlo.');
  if (id === 'negocio' && v.openingHours && lineas(v.openingHours).some(l => !/^(Mo|Tu|We|Th|Fr|Sa|Su)([-,](Mo|Tu|We|Th|Fr|Sa|Su))*\s+\d{2}:\d{2}-\d{2}:\d{2}$/.test(l)))
    avisos.push('Algún tramo del horario no sigue el formato «Mo-Fr 09:00-14:00».');
  return { errores, avisos };
}

// Quita claves vacías (cadenas vacías, listas vacías, objetos sin datos) de forma recursiva.
function compactar(x) {
  if (Array.isArray(x)) {
    const a = x.map(compactar).filter(v => v !== undefined);
    return a.length ? a : undefined;
  }
  if (x && typeof x === 'object') {
    const entradas = Object.entries(x).map(([k, v]) => [k, compactar(v)]).filter(([, v]) => v !== undefined);
    const sinTipo = entradas.filter(([k]) => !k.startsWith('@'));
    return sinTipo.length ? Object.fromEntries(entradas) : undefined;
  }
  const s = typeof x === 'string' ? x.trim() : x;
  return s === '' || s === null || s === undefined ? undefined : s;
}

const numero = v => (limpio(v) ? Number(limpio(v).replace(',', '.')) : '');

/** Construye el objeto JSON-LD del tipo elegido. */
export function construir(id, v) {
  let obj;
  if (id === 'negocio') {
    obj = {
      '@type': v.subtipo || 'LocalBusiness', name: v.name, description: v.description, url: v.url, telephone: v.telephone, email: v.email,
      image: v.image, priceRange: v.priceRange,
      address: { '@type': 'PostalAddress', streetAddress: v.streetAddress, postalCode: v.postalCode, addressLocality: v.addressLocality,
        addressRegion: v.addressRegion, addressCountry: v.addressCountry },
      geo: limpio(v.latitude) && limpio(v.longitude) ? { '@type': 'GeoCoordinates', latitude: numero(v.latitude), longitude: numero(v.longitude) } : undefined,
      openingHours: lineas(v.openingHours),
      areaServed: lineas(v.areaServed).map(z => ({ '@type': 'City', name: z })),
      sameAs: lineas(v.sameAs),
    };
  } else if (id === 'organizacion') {
    obj = { '@type': 'Organization', name: v.name, legalName: v.legalName, url: v.url, logo: v.logo, description: v.description, email: v.email,
      telephone: v.telephone, foundingDate: v.foundingDate, vatID: v.vatID, sameAs: lineas(v.sameAs) };
  } else if (id === 'persona') {
    obj = { '@type': 'Person', name: v.name, jobTitle: v.jobTitle, description: v.description, url: v.url, image: v.image,
      worksFor: limpio(v.worksFor) ? { '@type': 'Organization', name: v.worksFor } : undefined,
      address: limpio(v.addressLocality) ? { '@type': 'PostalAddress', addressLocality: v.addressLocality } : undefined,
      knowsAbout: lineas(v.knowsAbout), sameAs: lineas(v.sameAs) };
  } else if (id === 'faq') {
    obj = { '@type': 'FAQPage', mainEntity: (v.preguntas || []).filter(p => limpio(p.q) && limpio(p.a))
      .map(p => ({ '@type': 'Question', name: limpio(p.q), acceptedAnswer: { '@type': 'Answer', text: limpio(p.a) } })) };
  } else if (id === 'articulo') {
    obj = { '@type': v.subtipo || 'BlogPosting', headline: v.headline, description: v.description, image: v.image, datePublished: v.datePublished,
      dateModified: v.dateModified || v.datePublished, mainEntityOfPage: v.url,
      author: limpio(v.author) ? { '@type': 'Person', name: v.author, url: v.authorUrl } : undefined,
      publisher: limpio(v.publisher) ? { '@type': 'Organization', name: v.publisher, logo: limpio(v.publisherLogo) ? { '@type': 'ImageObject', url: v.publisherLogo } : undefined } : undefined };
  } else {
    throw new Error(`Tipo desconocido: ${id}`);
  }
  return { '@context': 'https://schema.org', ...(compactar(obj) || { '@type': obj['@type'] }) };
}

/** Etiqueta <script> lista para pegar en el <head> (escapa «<» para que no cierre el script). */
export function etiqueta(objeto) {
  return `<script type="application/ld+json">\n${JSON.stringify(objeto, null, 2).replace(/</g, '\\u003c')}\n</script>`;
}
