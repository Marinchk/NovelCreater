import fs from 'fs'
import cors from 'cors'
import express, { response } from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import cookieParser from 'cookie-parser'


import scenes from './models/scenes.js'


const port = 3000
const corsOptions = {
  origin: ['localhost', '46.36.223.228']
}
const app = express()

app.use(cors())
app.use(bodyParser.json())
express.urlencoded({ extended: false })
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

// app.get('/ping/:param', cors(corsOptions), (req, res) => {
//   const headIndex = req.rawHeaders.findIndex(el => el === 'StupidHead')
//   const pook = 'book'
//   res.status(404).send('amazing '
//     + req.params.param + ' '
//     + req.query.var + ' '
//     + req.rawHeaders[headIndex + 1] + ' '
//     + req.body.name)
// })

app.get('/scenes', async (req, res) => {
  const sceneArray = await scenes.find({})
  if (!sceneArray) {
    res.status(500).json({ message: 'не найдена сцена' })
  } else {
    res.status(200).json(sceneArray)
  }
})

app.get('/scenes/:id', async (req, res) => {
  const findScene = await scenes.findById(req.params.id)
  res.status(200).json(findScene)
})

app.put('/scenes/:id', async (req, res) => {
  const newScene = await scenes.findById(req.params.id)
  newScene.text = req.body.text
  newScene.image = req.body.image
  newScene.linkArray = req.body.linkArray

  const resSave = await newScene.save()
  if (!resSave) {
    res.status(500).json({ message: 'Сцена не изменена' })
  } else {
    res.status(200).json({ message: 'Сцена изменена' })
  }
})

app.post('/scenes', async (req, res) => {
  const scene = new scenes({
    text: req.body.text,
    image: req.body.image,
    linkArray: req.body.linkArray
  })

  const clone = await scenes.findById(req.params.id)

  if (!clone) {
    const resSave = await scene.save()
    if (!resSave) {
      res.status(500).json({ message: 'Сцена не сохранена' })
    } else {
      res.status(200).json({ message: 'Сцена сохранена' })
    }
  } else
    res.status(400).json({ message: 'сцена с таким именем уже существует' })
})

app.delete('/scenes/:id', async (req, res) => {
  const deleteScene = await scenes.findById(req.params.id)

  if (!deleteScene) {
    res.status(500).json({ message: 'Cцена не найдена' })
  } else {
    scenes.deleteOne({ id: res.param.id })
    res.status(200).json({ message: 'Сцена удалена' })
  }
})

// app.get('/homepage', async (req, res) => {
//   const text = `<!DOCTYPE html>
// <html lang="en">

// <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">

// </head>

// <body>
//     <h1>Нажми на кнопку</h1>
//     <form>
//         <button type="submit" formaction="http://46.36.223.228:3000/scenes">Получить все</button>


//     </form>
// </body>

// </html>`
//   res.status(200).send(text)
// })

app.listen(port, () => {
  console.log('сервер запущен на порту ', port, ' ...')
})



