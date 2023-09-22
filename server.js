import fs from 'fs'
import cors from 'cors'
import express, { response } from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import routerScenes from './router/scenes.js'

const swaggerNovel = JSON.parse(fs.readFileSync('./swagger/novelCon.json'))

dotenv.config()
const port = process.env.PORT || process.env.DEBUG_PORT
const corsOptions = {
  origin: ['localhost', process.env.IP_HOST]
}
const app = express()

app.use(cors())
app.use(bodyParser.json())
express.urlencoded({ extended: false })
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

app.use('/scenes', routerScenes)

// const swaggerHtmlNovel = swaggerUi.generateHTML(swaggerNovel)
// app.use('/swagger', swaggerUi.serveFiles(swaggerNovel))
// app.get('/swagger', (req, res) => { res.send(swaggerHtmlNovel) })
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerNovel))

app.listen(port, () => {
  console.log('сервер запущен на порту ', port, ' ...')
})

