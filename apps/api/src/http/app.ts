import express from 'express'
import cors from 'cors'
import path from 'node:path'

import { setupRoutes } from './routes'
import { env } from '@/env'
import bodyParser from 'body-parser'

export const app = express()

app.use(express.json())
app.use(bodyParser.urlencoded())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors({
  origin: env.WEB_URL,
  credentials: true,
}))

app.use('/thumbnails', express.static(path.join(process.cwd(), 'thumbnails')))
app.get('/', (req, res) => {
  res.send('Hello, World!')
})

setupRoutes(app)

export function startServer(port: number) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}