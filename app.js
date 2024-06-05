import express, { json } from 'express'
import { corstMiddleware } from './middlewares/cors.js'
import { moviesRouter } from './routes/movies.js'

const app = express()
//Para que mande toda la data parseada con un middleware interno
app.use(json())
//Desactivar la publicidad de express
app.disable('x-powered-by')

console.log('here',import.meta)

app.use(corstMiddleware())

app.use('/movies', moviesRouter)

const PORT = process.env.PORT || 1234

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})