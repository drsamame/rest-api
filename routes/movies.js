import { Router } from "express";
import { MoviesController } from "../controllers/movies.js";

export const createMovieRouter = ({ movieModel }) => {
    const moviesRouter = Router()

    const controller = new MoviesController({ movieModel })

    moviesRouter.get("/", controller.getAll)

    moviesRouter.get('/:id', controller.getById)

    moviesRouter.post('/', controller.create)

    moviesRouter.delete('/:id', controller.delete)

    moviesRouter.patch('/:id', controller.update)

    return moviesRouter
}
