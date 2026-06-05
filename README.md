# avatarlookup-js
## Requisitos

* `Node.js 18+`
* Bot de Discord con intents `Guilds` y `GuildMembers`
* Acceso al servidor donde esté el rol objetivo

---

## Instalación

Instalar dependencias:

```bash
pnpm install
```

Crear archivo `.env` con el token del bot:

```
TOKEN=your_bot_token
ROLE_ID=your_role_id
```

---

## Uso

### Descarga de avatares (role-based)

* El script obtiene todos los miembros con el rol definido en `ROLE_ID`
* Descarga sus avatares en formato `.webp` (512px)
* Guarda los archivos en la carpeta `/team`

Ejecutar script:

```bash
node index.js
```

---

### 📁 Output

Ejemplo de estructura generada:

```
team/
 ├── user1.webp
 ├── user2.webp
 ├── user3.webp
 ├── user3_2.webp
```

> Si hay nombres duplicados, se añade automáticamente `_2`, `_3`, etc.

---

## Progreso

Durante la ejecución se muestra un CLI en tiempo real:

```
⠙ Descargando [███████████░░░░░░░░░░] 42/120 (35%)
✔ Completado: 120/120 avatares descargados
```

---

## Comportamiento

* Busca el rol en todos los servidores donde está el bot
* Hace `fetch()` de miembros antes de procesar
* Descarga avatares en alta calidad (512px)
* Sanitiza usernames para nombres de archivo válidos
* Evita colisiones de archivos automáticamente

---

## Notas

* El bot debe tener permisos de lectura de miembros
* El proceso es secuencial (no paralelo)
* Si falla un usuario, continúa con el siguiente
* Diseñado para roles medianos/grandes
