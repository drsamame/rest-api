import express, { json } from 'express';

import { validateMovie, validatePartialMovie } from './schema/movie.js';
import cors from 'cors';

const app = express()
//Para que mande toda la data parseada con un middleware interno
app.use(json())
//Desactivar la publicidad de express
app.disable('x-powered-by')

import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const movies = require('./movies.json')

app.use(cors(
  {
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080'
      ]

      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }

      if (!origin) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    }
  }))

// Todos los recursos que sean MOVIES se idenficia con /movies
app.get('/movies', (req, res) => {
  const { genre } = req.query
  if (genre) {
    const filteredMovies =
      movies.filter(movie => movie.genre.some((gen) => gen.toLowerCase() === genre.toLowerCase()))
    return res.json(filteredMovies)
  }
  res.json(movies)
})

app.get('/movies/:id', (req, res) => {
  const { id } = req.params
  const movie = movies.find(movie => movie.id === id)
  if (movie) return res.json(movie)
  res.status(404).json({ error: 'Movie not found' })
})

app.post('/movies', (req, res) => {

  const result = validateMovie(req.body)
  console.log(result.error)

  if (result.error) {
    return res.status(400).json({ error: result.error.message })
  }

  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data
  }

  movies.push(newMovie)
  res.status(201).json(newMovie)
})

app.delete('/movies/:id', (req, res) => {
  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)

  if (movieIndex === -1) {
    return res.status(404).json({ message: 'Movie not found' })
  }

  movies.splice(movieIndex, 1)

  return res.json({ message: 'Movie deleted' })
})


app.patch('/movies/:id', (req, res) => {

  const result = validatePartialMovie(req.body)
  if (!result.success) {
    return res.status(400).json({ error: JSON.parse(result.error.message) })
  }

  const { id } = req.params
  const movieIndex = movies.findIndex(movie => movie.id === id)
  const movie = movies[movieIndex]

  if (movieIndex === -1) {
    return res.status(404).json({ error: 'Movie not found' })
  }

  const updatedMovie = {
    ...movie,
    ...result.data
  }

  movies[movieIndex] = updatedMovie

  res.status(201).json(updatedMovie)
})

const PORT = process.env.PORT || 1234

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})