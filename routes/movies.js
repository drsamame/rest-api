import { Router } from "express";
import { moviesController } from "../controllers/movies.js";

export const moviesRouter = Router()

moviesRouter.get("/", moviesController.getAll)

moviesRouter.get('/:id', moviesController.getById)

moviesRouter.post('/', moviesController.create)

moviesRouter.delete('/:id', moviesController.delete)

moviesRouter.patch('/:id', moviesController.update)