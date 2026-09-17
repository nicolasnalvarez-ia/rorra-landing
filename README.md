# rorra-landing

Landing de Rocío Romero (content creator / UGC) con un panel de administración
para manejar las fotos sin tocar código.

## Correr el proyecto

```bash
npm install
npm run dev
```

La landing queda en http://localhost:3000 y el panel en http://localhost:3000/admin.

## Variables de entorno

Copiá `.env.example` a `.env.local` y completá:

| Variable | Para qué |
| --- | --- |
| `ADMIN_PASSWORD` | Contraseña inicial de `/admin`. Se puede cambiar desde el panel sin redeploy. |
| `SUPABASE_URL` | URL del proyecto de Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (no la anon): las subidas y borrados son del lado del servidor. |

En Supabase hacen falta dos buckets **públicos**:

- `fotos` — las imágenes que se suben desde el panel.
- `site-data` — el JSON con el contenido del sitio y el hash de la contraseña.

Sin estas variables la landing igual funciona: usa las fotos incluidas en
`public/photos` y el contenido por defecto de `lib/content.ts`.

## El panel de admin

`/admin`, protegido por contraseña (cookie de sesión, sin base de datos).
Permite:

- **Hero y Sobre mí**: cambiar cada foto y ajustar el encuadre (posición y zoom
  sobre un recorte 3:4).
- **Portfolio**: crear, renombrar, reordenar y borrar categorías; agregar,
  quitar, reordenar y recortar sus fotos. La primera foto de cada categoría es
  la portada que se ve en la grilla.
- **Biblioteca**: subir varias fotos a la vez (arrastrando o eligiendo) y
  borrarlas de verdad.

Detalles que valen la pena saber:

- **Las fotos se optimizan en el navegador** antes de subirse: se reduce el lado
  más largo a 2400px y se recodifica a WEBP con calidad alta. Una foto de
  celular pasa de varios MB a unos cientos de KB sin pérdida visible. Los GIF no
  se tocan para no perder la animación.
- **No hay duplicados**: cada archivo se guarda bajo el hash SHA-256 de su
  contenido, así que subir la misma foto otra vez (aunque tenga otro nombre)
  reutiliza la que ya estaba.
- **Borrar borra en serio**: saca la foto de la biblioteca, del portfolio y del
  storage de Supabase. Si está puesta en el Hero o en Sobre mí, primero hay que
  reemplazarla ahí (esos lugares no pueden quedar vacíos).
- Las fotos que vienen con el proyecto (`public/photos`) se pueden sacar de la
  biblioteca, pero el archivo no se borra.

Todo lo que el panel guarda se valida en el servidor antes de escribirse
(`lib/validate.ts`): solo se aceptan URLs de los buckets del proyecto o de
`public/photos`, y el guardado revalida la landing para que el cambio se vea al
instante.
