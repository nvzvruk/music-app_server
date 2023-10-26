import 'dotenv/config'
import { writeFileSync } from 'fs'
import { faker } from '@faker-js/faker'
import { getRandomInt } from '@/shared/utils'

// TODO: Import models from @/entities
interface BaseData {
  _id: string
  name: string
  genres: string[]
}

interface TrackInitialModel extends BaseData {
  src: string
}

interface TrackModel extends TrackInitialModel {
  albumId?: string
  artistId: string
}

interface AlbumModel<T = string> extends BaseData {
  name: string
  genres: string[]
  cover?: string
  tracks: T[]
}

interface ArtistModel<A = string, S = string> extends BaseData {
  country: string
  followersCount: number
  albums: Array<A>
  singles: Array<S>
}

type AlbumInitialModel = AlbumModel<TrackInitialModel>
type ArtistInitialModel = ArtistModel<AlbumInitialModel, TrackInitialModel>

interface IData {
  artists: ArtistModel[]
  albums: AlbumModel[]
  tracks: TrackModel[]
  generateData: (artistCount?: number) => void
}

export class DataGenerator implements IData {
  artists: ArtistModel[] = []
  albums: AlbumModel[] = []
  tracks: TrackModel[] = []

  private getAlbumCoverSrc = (number: number): string => {
    return `${process.env.S3_BUCKET}/images/album-cover/${number}.jpg`
  }

  private createTrack = (): TrackInitialModel => {
    return {
      _id: faker.database.mongodbObjectId(),
      name: faker.music.songName(),
      src: faker.image.url(),
      genres: faker.helpers.multiple(faker.music.genre, {
        count: getRandomInt(1, 2),
      }),
    }
  }

  private createAlbum = (): AlbumInitialModel => {
    return {
      _id: faker.database.mongodbObjectId(),
      name: faker.music.songName(),
      tracks: faker.helpers.multiple(this.createTrack, {
        count: getRandomInt(4, 10),
      }),
      genres: faker.helpers.multiple(faker.music.genre, {
        count: getRandomInt(1, 3),
      }),
    }
  }

  private createArtist = (): ArtistInitialModel => {
    return {
      _id: faker.database.mongodbObjectId(),
      name: faker.person.firstName(),
      country: faker.location.country(),
      followersCount: getRandomInt(1, 4000000),
      albums: faker.helpers.multiple(this.createAlbum, {
        count: getRandomInt(1, 3),
      }),
      singles: faker.helpers.multiple(this.createTrack, {
        count: getRandomInt(1, 5),
      }),
      genres: faker.helpers.multiple(faker.music.genre, {
        count: getRandomInt(1, 3),
      }),
    }
  }

  generateData = (artistCount: number | undefined = 100): void => {
    let albumCoverIndex = 1
    const artists = faker.helpers.multiple(this.createArtist, { count: artistCount })

    artists.forEach(({ albums, singles, ...artist }) => {
      const tracksToAdd: TrackModel[] = singles.map((track) => ({
        ...track,
        artistId: artist._id,
      }))

      const albumsToAdd: AlbumModel[] = albums.map(({ tracks, ...album }) => {
        const cover = this.getAlbumCoverSrc(albumCoverIndex)

        if (albumCoverIndex < 50) {
          albumCoverIndex++
        } else {
          albumCoverIndex = 1
        }

        return {
          ...album,
          artistId: artist._id,
          cover,
          tracks: tracks.map((track) => {
            tracksToAdd.push({
              ...track,
              albumId: album._id,
              artistId: artist._id,
            })
            return track._id
          }),
        }
      })

      this.tracks = [...this.tracks, ...tracksToAdd]
      this.albums = [...this.albums, ...albumsToAdd]
      this.artists.push({
        ...artist,
        albums: albums.map((album) => album._id),
        singles: singles.map((single) => single._id),
      })
    })

    try {
      writeFileSync('dist/data/artists.json', JSON.stringify(this.artists))
      writeFileSync('dist/data/albums.json', JSON.stringify(this.albums))
      writeFileSync('dist/data/tracks.json', JSON.stringify(this.tracks))
      console.log('File created and data written successfully.')
    } catch (error) {
      console.error('An error occurred:', error)
    }
  }
}

const dataGenerator = new DataGenerator()

dataGenerator.generateData()
