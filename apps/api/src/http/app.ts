import express from 'express'

export const app = express()

app.get('/', (req, res) => {
  res.send('Hello, World!')
})

export function startServer(port: number) {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}