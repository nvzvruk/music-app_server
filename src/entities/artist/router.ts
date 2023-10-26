import express from "express";
import { artistController } from './controller'

export const artistRouter = express.Router()
artistRouter.post('/artist', artistController.create)
artistRouter.get('/artists', artistController.getAll)
artistRouter.get('/artist/:id', artistController.getById)
artistRouter.put('/artist/:id', artistController.update)
artistRouter.delete('/artist/:id', artistController.remove)