import { model, Model, Document, Schema } from 'mongoose'

export interface IArtist<A = string, S = string> extends Document {
  name: string
  genres: string
  country: string
  followersCount: number
  albums: Array<A>
  singles: Array<S>
}

const artistSchema = new Schema({
  name: String,
  country: String,
  followersCount: String,
  genres: Array<String>,
  albums: Array<String>,
  singles: Array<String>,
})

export const ArtistModel: Model<IArtist> = model<IArtist>(
  'Artist',
  artistSchema
)
