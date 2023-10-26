import { model, Model, Document, Schema } from 'mongoose'

export interface IAlbum<T = string> extends Document {
  name: string
  genres: string[]
  cover: string
  tracks: T[]
}

const albumSchema = new Schema({
  name: String,
  cover: String,
  genres: Array<String>,
  tracks: Array<String>,
})

export const AlbumModel: Model<IAlbum> = model<IAlbum>('Album', albumSchema)
