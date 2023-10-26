import express from "express";
import { albumController } from './controller'

export const albumRouter = express.Router();

albumRouter.post('/album', albumController.create)
albumRouter.get('/albums', albumController.getAll)
albumRouter.get('/album/:id', albumController.getById)
albumRouter.put('/album/:id', albumController.update)
albumRouter.delete('/album/:id', albumController.remove)