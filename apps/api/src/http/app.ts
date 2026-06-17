import express from 'express'
import cors from 'cors'

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

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

setupRoutes(app)

export function startServer(port: number) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}