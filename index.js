import express from 'express'
import router from './routes/index.route.js'
import PinoHttp, { pinoHttp } from 'pino-http'
import logger from './configs/pino.config.js'
import { v2 as cloudinary } from 'cloudinary'
const app = express()
const port = 3000
app.use(pinoHttp())
app.use(express.json())
app.use(router)


if (process.env.ENV !== 'production') {
  const port = process.env.PORT || 3000
app.listen(port, () => {
  logger.info(`Server is running at http://localhost:${port}`)
  logger.info(`Application started successfuly`)
})
}

export default app



