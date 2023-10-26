import { CrudController } from "@/shared/crud-controller";
import { ArtistModel, IArtist } from "./model";

export const artistController = new CrudController<IArtist>('artists', ArtistModel)