import { CrudController } from "@/shared/crud-controller";
import { PlaylistModel, IPlaylist } from "./model";

export const albumController = new CrudController<IPlaylist>('playlists', PlaylistModel)