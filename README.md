# jsonld-generator

**Datos estructurados para tu web rellenando un formulario, sin escribir código.**

👉 **Pruébala:** https://marcodiezferreira.github.io/jsonld-generator/

Los datos estructurados (JSON-LD) le dicen a Google, en su idioma, quién eres, dónde estás, qué horario tienes o qué responde tu página de preguntas frecuentes. Ayudan a que tu negocio salga mejor en los resultados y en Maps, y a que los buscadores con IA te citen con datos correctos.

## Qué hace

- **Cinco tipos:** negocio local (con 17 subtipos: restaurante, clínica dental, fontanería, inmobiliaria…), organización, persona, preguntas frecuentes y artículo.
- **Te dice qué falta:** marca los campos obligatorios y los recomendados según la documentación de Google, y avisa de formatos incorrectos (direcciones, emails, horarios).
- **Código limpio:** solo incluye lo que rellenas, sin campos vacíos.
- **Listo para pegar:** genera la etiqueta `<script type="application/ld+json">` completa, o el `.json` para descargar.
- **Recuerda lo que escribiste** en este navegador, por si vuelves mañana.
- **Privada:** no hay servidor. Nada sale de tu navegador.

## Cómo se usa

1. Elige el tipo y rellena el formulario.
2. Copia el código y pégalo dentro del `<head>` de la página (en WordPress, con cualquier plugin de código en cabecera).
3. Compruébalo en la [prueba de resultados enriquecidos de Google](https://search.google.com/test/rich-results) y en el [validador de Schema.org](https://validator.schema.org/).

El horario usa el formato de Schema.org: una línea por tramo, por ejemplo `Mo-Fr 09:00-14:00` o `Sa 10:00-13:00`.

## Usarla en local

No necesita instalación ni compilación. Sírvela con cualquier servidor estático (los módulos de JavaScript no funcionan abriendo el fichero con doble clic):

```bash
python -m http.server 8000
```

Y abre http://localhost:8000.

## Publicarla en GitHub Pages

En el repositorio: **Settings → Pages → Branch: `main` / carpeta `/ (root)` → Save**. En un minuto estará en `https://<tu-usuario>.github.io/jsonld-generator/`.

## Estructura

```
index.html          la página
styles.css          estilos (modo claro y oscuro)
src/esquemas.js     tipos, campos, revisión y construcción del JSON-LD (sin DOM)
src/app.js          interfaz
test/               pruebas de la lógica
```

¿Quieres otro tipo (producto, evento, receta…)? Se añade un bloque en `ESQUEMAS` y su caso en `construir()`.

## Pruebas

```bash
npm test
```

## Autor

Hecho por [Marco Díez](https://marcodiez.es): marketing digital y desarrollo.
¿Quieres que tu negocio se vea mejor en Google? [Escríbeme](https://marcodiez.es/contacto/).

Licencia MIT.
