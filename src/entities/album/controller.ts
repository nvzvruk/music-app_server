import { CrudController } from "@/shared/crud-controller";
import { AlbumModel, IAlbum } from "./model";

export const albumController = new CrudController<IAlbum>('albums', AlbumModel)