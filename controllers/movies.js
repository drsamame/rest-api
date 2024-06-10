import { validateMovie, validatePartialMovie } from '../schema/movie.js';
import { MovieModel } from "../models/mysql/movie.js";
export class moviesController {
    static async getAll(req, res) {
        const { genre } = req.query
        const movies = await MovieModel.getAll({ genre })
        res.json(movies)
    }

    static async getById(req, res) {
        const { id } = req.params
        const movie = await MovieModel.getById({ id })
        if (movie) return res.json(movie)
        res.status(404).json({ error: 'Movie not found' })
    }

    static async create(req, res) {
        const result = validateMovie(req.body)
        if (result.error) {
            return res.status(400).json({ error: result.error.message })
        }
        const newMovie = await MovieModel.create({ input: result.data })
        res.status(201).json(newMovie)
    }

    static async update(req, res) {

        const result = validatePartialMovie(req.body)
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const { id } = req.params
        const updatedMovie = await MovieModel.update({ input: result.data, id })

        if (!updatedMovie) {
            return res.status(404).json({ error: 'Movie not found' })
        }

        res.status(201).json(updatedMovie)
    }

    static async delete(req, res) {
        const { id } = req.params

        const movieIndex = await MovieModel.delete({ id })
        if (!movieIndex) {
            return res.status(404).json({ message: 'Movie not found' })
        }
        return res.json({ message: 'Movie deleted' })
    }
}