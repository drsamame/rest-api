import { validateMovie, validatePartialMovie } from '../schema/movie.js';
export class MoviesController {
    constructor({ movieModel }) {
        this.movieModel = movieModel;
    }
    getAll = async (req, res) => {
       
        const { genre } = req.query
        const movies = await this.movieModel.getAll({ genre })
        console.log(movies)
        res.json(movies)
    }
    getById = async (req, res) => {
        const { id } = req.params
        const movie = await this.movieModel.getById({ id })
        if (movie) return res.json(movie)
        res.status(404).json({ error: 'Movie not found' })
    }
    create = async (req, res) => {
        const result = validateMovie(req.body)
        if (result.error) {
            return res.status(400).json({ error: result.error.message })
        }
        const newMovie = await this.movieModel.create({ input: result.data })
        res.status(201).json(newMovie)
    }
    update = async (req, res) => {

        const result = validatePartialMovie(req.body)
        if (!result.success) {
            return res.status(400).json({ error: JSON.parse(result.error.message) })
        }

        const { id } = req.params
        const updatedMovie = await this.movieModel.update({ input: result.data, id })

        if (!updatedMovie) {
            return res.status(404).json({ error: 'Movie not found' })
        }

        res.status(201).json(updatedMovie)
    }
    delete = async (req, res) => {
        const { id } = req.params

        const movieIndex = await this.movieModel.delete({ id })
        if (!movieIndex) {
            return res.status(404).json({ message: 'Movie not found' })
        }
        return res.json({ message: 'Movie deleted' })
    }
}