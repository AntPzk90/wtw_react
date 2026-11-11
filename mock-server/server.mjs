// Local mock of the htmlacademy "What to Watch" API, built on json-server.
// json-server alone turns numeric ids into strings and has no routes like
// /favorite/:id/:status, so the WTW endpoints are handled here and everything
// else (images from ./static, raw collections) falls through to it.
import { createServer } from 'node:http'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp } from 'json-server/lib/app.js'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

const PORT = Number(process.env.API_PORT) || 3001
const ORIGIN = `http://localhost:${PORT}`
const SERVER_DIR = dirname(fileURLToPath(import.meta.url))
const DB_FILE = join(SERVER_DIR, 'db.json')
const SIMILAR_COUNT = 4
const FILMS_PAGE_SIZE = 8
const FILMS_MAX_PAGE_SIZE = 50
const COMMENT_MIN_LENGTH = 10
const COMMENT_MAX_LENGTH = 400
const MAX_STARS = 5

const db = new Low(new JSONFile(DB_FILE), {})
await db.read()

// db.json stores image paths relative to ./static, responses get full URLs.
const jsonServer = createApp(db, {
  logger: false,
  static: [join(SERVER_DIR, 'static')],
})

const send = (res, status, data) => {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(data === undefined ? '' : JSON.stringify(data))
}

const readBody = (req) =>
  new Promise((resolve) => {
    let raw = ''
    req.on('data', (chunk) => (raw += chunk))
    req.on('end', () => {
      try {
        resolve(JSON.parse(raw || '{}'))
      } catch {
        resolve(null)
      }
    })
  })

const toUrl = (path) => (/^https?:\/\//.test(path) ? path : `${ORIGIN}/${path}`)

const emailToToken = (email) => Buffer.from(email).toString('base64')

const getUser = (req) => {
  const token = req.headers['x-token']
  if (!token) return undefined
  return db.data.users.find((user) => user.token === token)
}

const toClientUser = (user) => ({ ...user, avatarUrl: toUrl(user.avatarUrl) })

const toClientFilm = (film, user) => ({
  ...film,
  posterImage: toUrl(film.posterImage),
  previewImage: toUrl(film.previewImage),
  backgroundImage: toUrl(film.backgroundImage),
  isFavorite: Boolean(
    user && db.data.favorites.some((item) => item.email === user.email && item.filmId === film.id),
  ),
})

// Positive integer from the query string, or the fallback if it is missing or invalid.
const toPositiveInt = (value, fallback) => {
  const number = Number(value)
  return Number.isInteger(number) && number > 0 ? number : fallback
}

const findFilm = (id) => db.data.films.find((film) => film.id === Number(id))

const getComments = (filmId) =>
  db.data.comments
    .filter((item) => item.filmId === filmId)
    .map(({ filmId: _filmId, ...comment }) => comment)

const notFound = (res, id) => send(res, 404, { error: `Film id ${id} does not exist` })

const unauthorized = (res) =>
  send(res, 401, {
    error: 'You are not logged in or you do not have permission to this page.',
  })

const routes = [
  [
    'GET',
    /^\/films$/,
    // ?page=1&limit=8&genre=Drama, all optional; out-of-range pages give an empty items list.
    (req, res, _match, query) => {
      const user = getUser(req)
      const genre = query.get('genre')
      const page = toPositiveInt(query.get('page'), 1)
      const limit = Math.min(
        toPositiveInt(query.get('limit'), FILMS_PAGE_SIZE),
        FILMS_MAX_PAGE_SIZE,
      )
      const films = genre ? db.data.films.filter((film) => film.genre === genre) : db.data.films
      const start = (page - 1) * limit
      send(res, 200, {
        items: films.slice(start, start + limit).map((film) => toClientFilm(film, user)),
        page,
        limit,
        total: films.length,
        hasMore: start + limit < films.length,
      })
    },
  ],

  [
    'GET',
    /^\/genres$/,
    (req, res) => send(res, 200, [...new Set(db.data.films.map((film) => film.genre))]),
  ],

  [
    'GET',
    /^\/films\/([^/]+)$/,
    (req, res, [id]) => {
      const film = findFilm(id)
      if (!film) return notFound(res, id)
      send(res, 200, toClientFilm(film, getUser(req)))
    },
  ],

  [
    'GET',
    /^\/films\/([^/]+)\/similar$/,
    (req, res, [id]) => {
      const film = findFilm(id)
      if (!film) return notFound(res, id)
      const user = getUser(req)
      send(
        res,
        200,
        db.data.films
          .filter((item) => item.genre === film.genre && item.id !== film.id)
          .slice(0, SIMILAR_COUNT)
          .map((item) => toClientFilm(item, user)),
      )
    },
  ],

  [
    'GET',
    /^\/promo$/,
    (req, res) => {
      const film = findFilm(db.data.promo.filmId)
      if (!film) return notFound(res, db.data.promo.filmId)
      send(res, 200, toClientFilm(film, getUser(req)))
    },
  ],

  [
    'GET',
    /^\/favorite$/,
    (req, res) => {
      const user = getUser(req)
      if (!user) return unauthorized(res)
      send(
        res,
        200,
        db.data.films.map((film) => toClientFilm(film, user)).filter((film) => film.isFavorite),
      )
    },
  ],

  [
    'POST',
    /^\/favorite\/([^/]+)\/([01])$/,
    async (req, res, [id, status]) => {
      const user = getUser(req)
      if (!user) return unauthorized(res)
      const film = findFilm(id)
      if (!film) return notFound(res, id)
      db.data.favorites = db.data.favorites.filter(
        (item) => !(item.email === user.email && item.filmId === film.id),
      )
      if (status === '1') {
        db.data.favorites.push({ email: user.email, filmId: film.id })
      }
      await db.write()
      send(res, 200, toClientFilm(film, user))
    },
  ],

  [
    'GET',
    /^\/comments\/([^/]+)$/,
    (req, res, [id]) => {
      const film = findFilm(id)
      if (!film) return notFound(res, id)
      send(res, 200, getComments(film.id))
    },
  ],

  [
    'POST',
    /^\/comments\/([^/]+)$/,
    async (req, res, [id]) => {
      const user = getUser(req)
      if (!user) return unauthorized(res)
      const film = findFilm(id)
      if (!film) return notFound(res, id)
      const body = await readBody(req)
      const comment = body && typeof body.comment === 'string' ? body.comment.trim() : ''
      const rating = body ? Number(body.rating) : NaN
      if (
        comment.length < COMMENT_MIN_LENGTH ||
        comment.length > COMMENT_MAX_LENGTH ||
        !Number.isInteger(rating) ||
        rating < 1 ||
        rating > MAX_STARS
      ) {
        return send(res, 400, {
          error: `Comment (${COMMENT_MIN_LENGTH}-${COMMENT_MAX_LENGTH} characters) and rating (1-${MAX_STARS}) are required`,
        })
      }
      db.data.comments.push({
        id: Math.max(0, ...db.data.comments.map((item) => item.id)) + 1,
        filmId: film.id,
        user: { id: user.id, name: user.name },
        comment,
        rating,
        date: new Date().toISOString(),
      })
      await db.write()
      send(res, 200, getComments(film.id))
    },
  ],

  [
    'GET',
    /^\/login$/,
    (req, res) => {
      const user = getUser(req)
      if (!user) return unauthorized(res)
      send(res, 200, toClientUser(user))
    },
  ],

  [
    'POST',
    /^\/login$/,
    async (req, res) => {
      const body = await readBody(req)
      const email = body && typeof body.email === 'string' ? body.email.trim() : ''
      const password = body && typeof body.password === 'string' ? body.password : ''
      if (!/^\S+@\S+\.\S+$/.test(email) || !password) {
        return send(res, 400, {
          error: 'Valid email and non-empty password are required',
        })
      }
      let user = db.data.users.find((item) => item.email === email)
      if (!user) {
        user = {
          avatarUrl: 'img/avatar.jpg',
          email,
          id: Math.max(0, ...db.data.users.map((item) => item.id)) + 1,
          name: email.split('@')[0],
          token: emailToToken(email),
        }
        db.data.users.push(user)
        await db.write()
      }
      send(res, 200, toClientUser(user))
    },
  ],

  ['DELETE', /^\/logout$/, (req, res) => send(res, 204)],

  // the academy server had no index route
  ['GET', /^\/$/, (req, res) => send(res, 404, { error: 'Not Found' })],
]

createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS')
  res.setHeader(
    'Access-Control-Allow-Headers',
    req.headers['access-control-request-headers'] || 'Content-Type,X-Token',
  )
  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    return res.end()
  }

  const url = new URL(req.url, ORIGIN)
  const path = url.pathname.replace(/\/+$/, '') || '/'
  for (const [method, pattern, handler] of routes) {
    const match = req.method === method && path.match(pattern)
    if (match) {
      return Promise.resolve(handler(req, res, match.slice(1), url.searchParams)).catch((err) => {
        console.error(err)
        send(res, 500, { error: 'Internal Server Error' })
      })
    }
  }

  jsonServer.attach(req, res)
}).listen(PORT, () => {
  console.log(`What to Watch mock API: ${ORIGIN}`)
})
