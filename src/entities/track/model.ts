import { model, Model, Document, Schema } from 'mongoose'

export interface ITrackInitial extends Document {
  src: string
  name: string
  genres: string[]
}

export interface ITrack extends ITrackInitial, Document {
  artistId: string
}

export interface ISingle extends ITrack, Document {
  albumId?: string
}

const trackSchema = new Schema<ITrack | ISingle>({
  _id: String,
  name: String,
  src: String,
  albumId: String,
  artistId: String,
  genres: Array<String>,
})

export const TrackModel: Model<ITrack> = model<ITrack | ISingle>(
  'Track',
  trackSchema
)
