import fs from 'fs'
import cors from 'cors'
import express, { response } from 'express'
import bodyParser from 'body-parser'
import path from 'path'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import { db } from './db.js'
import scenes from './models/scenes.js'

dotenv.config()

const port = process.env.PORT
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

app.get('/scenes', async (req, res) => {
  const sceneArray = await scenes.find({})
  res.status(200).json(sceneArray)
})

app.get('/scenes/:name', async (req, res) => {
  const findScene = await scenes.findOne({ name: req.params.name })
  if (!findScene) {
    res.status(500).json({ message: 'Сцена с таким именем не найдена' })
  } else {
    res.status(200).json(findScene)
  }
})
app.put('/scenes/:name', async (req, res) => {
  const editScene = await scenes.findOne({ name: req.params.name })
  if (!editScene) {
    res.status(500).json({ message: 'Редактируемая сцена не найдена' })
  }

  editScene.name = req.body.name
  editScene.text = req.body.text
  editScene.image = req.body.image
  editScene.linkArray = req.body.linkArray

  const resSave = await editScene.save()
  if (!resSave) {
    res.status(500).json({ message: 'Сцена не изменена' })
  } else {
    res.status(200).json({ message: 'Сцена изменена' })
  }
})

app.post('/scenes', async (req, res) => {
  const scene = new scenes({
    name: req.body.name,
    text: req.body.text,
    image: req.body.image,
    linkArray: req.body.linkArray
  })

  const clone = await scenes.findOne({ name: req.body.name })

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

app.delete('/scenes/:name', async (req, res) => {
  const deleteScene = await scenes.findOne({ name: req.params.name })

  if (!deleteScene) {
    res.status(500).json({ message: 'Cцена не найдена' })
  } else {
    await scenes.deleteOne({ name: req.params.name })
    res.status(200).json({ message: 'Сцена удалена' })
  }
})

app.delete('/scenes', async (req, res) => {

  scenes.deleteMany({})
  res.status(200).json({ message: 'Все сцены удалены' })

})

app.listen(port, () => {
  console.log('сервер запущен на порту ', port, ' ...')
})


