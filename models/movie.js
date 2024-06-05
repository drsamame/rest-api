import { readJSON } from '../utils.js'
import { randomUUID } from 'node:crypto'
const movies = readJSON('./movies.json')
export class MovieModel {
    static async getAll({ genre }) {
        if (genre) {
            return movies.filter(movie => movie.genre.some((gen) => gen.toLowerCase() === genre.toLowerCase()))
        }
        return movies
    }

    static async getById({ id }) {
        console.log(id)
        const movie = movies.find(movie => movie.id === id)
        return movie
    }

    static async create({ input }) {

        const newMovie = {
            id: randomUUID(),
            ...input
        }

        movies.push(newMovie)

        return newMovie
    }

    static async delete({ id }) {
        const movieIndex = movies.findIndex(movie => movie.id === id)
        if (movieIndex === -1) return false
        movies.splice(movieIndex, 1)
        return true
    }

    static async update({ input, id }) {
        const movieIndex = movies.findIndex(movie => movie.id === id)
        if (movieIndex === -1) return false
        const movie = movies[movieIndex]
        const updatedMovie = {
            ...movie,
            ...input
        }
        movies[movieIndex] = updatedMovie

        return updatedMovie
    }

}
