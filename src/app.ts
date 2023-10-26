import express from 'express'
import * as bodyParser from 'body-parser'
import { artistRouter } from '@/entities/artist'
import { albumRouter } from '@/entities/album'

const app = express()
const PORT = process.env.PORT || 3002

app.use(bodyParser.json())

app.use(artistRouter)
app.use(albumRouter)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
