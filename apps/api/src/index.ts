import 'dotenv/config'

import { connectPostgres } from './database/sequelize'
import { startServer } from './http/app'

async function main() {
  await connectPostgres()
  
  startServer(7654)
}

main()