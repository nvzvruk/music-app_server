import { model, Model, Document, Schema } from 'mongoose';

export interface IPlaylist extends Document {
  id: string;
  title: string;
  tracks: string[];
}

const playlistSchema = new Schema({
  id: String,
  title: String,
  tracks: Array<String>
});

export const PlaylistModel: Model<IPlaylist> = model<IPlaylist>('Playlist', playlistSchema);
