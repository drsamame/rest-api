import mysql from 'mysql2/promise';

const config = {
    host: 'localhost',
    user: 'root',
    port: 3306,
    password: '',
    database: 'moviesdb'
}

const connection = await mysql.createConnection(config)

export class MovieModel {
    static async getAll({ genre }) {
        if (genre) {
            const lowerCaseGender = genre.toLowerCase()

            //gent genre ids from database table using genre names
            const [genres] = await connection.query(
                'SELECT * FROM genre WHERE LOWER(name) = ?;', [lowerCaseGender]
            )
            if (genres.length === 0) return []
            const [{ id }] = genres
            const resultMoviesIds = await connection.query(
                'SELECT BIN_TO_UUID(movie_id) id FROM movie_genres WHERE genre_id = ?;', [id]
            )
            const [result] = await connection.query(
                'SELECT * FROM movie WHERE BIN_TO_UUID(id) IN (?);', [resultMoviesIds[0].map((movie) => movie.id)]
            )
            return result
        }

        const [movies] = await connection.query(
            'SELECT title, YEAR, director, duration, poster, rate, BIN_TO_UUID(id) id FROM movie;')
        return movies
    }

    static async getById({ id }) {
        const [movies] = await connection.query(
            `SELECT title, YEAR, director, duration, poster, rate,
             BIN_TO_UUID(id) id FROM movie WHERE id = UUID_TO_BIN(?);`, [id])
        return movies
    }

    static async create({ input }) {
        const {
            genre: genreInput, // genre is an array
            title,
            year,
            duration,
            director,
            rate,
            poster
          } = input
      
          // todo: crear la conexión de genre
      
          // crypto.randomUUID()
          const [uuidResult] = await connection.query('SELECT UUID() uuid;')
          const [{ uuid }] = uuidResult
      
          try {
            await connection.query(
              `INSERT INTO movie (id, title, year, director, duration, poster, rate)
                VALUES (UUID_TO_BIN("${uuid}"), ?, ?, ?, ?, ?, ?);`,
              [title, year, director, duration, poster, rate]
            )
          } catch (e) {
            // puede enviarle información sensible
            console.log(e)
            throw new Error('Error creating movie')
            // enviar la traza a un servicio interno
            // sendLog(e)
          }
      
          const [movies] = await connection.query(
            `SELECT title, year, director, duration, poster, rate, BIN_TO_UUID(id) id
              FROM movie WHERE id = UUID_TO_BIN(?);`,
            [uuid]
          )
      
          return movies[0]
    }

    static async delete({ id }) {

    }

    static async update({ id, input }) {

    }
}