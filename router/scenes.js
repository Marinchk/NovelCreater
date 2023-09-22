import scenes from '../models/scenes.js'
import { db } from '../db.js'
import { Router } from 'express'
const routerScenes = Router()

routerScenes.get('/ping', async (req, res) => {
    res.status(200).json({ pong: true })
})

routerScenes.get('/', async (req, res) => {
    // #swagger.tags = ['Сцены']
    // #swagger.summary = 'Получение всех сцен'
    /* #swagger.description = 'Возвращает массив объектов, где каждый объект является является сценой' */
    /* #swagger.responses[200] = {
        description: 'OK',
        schema: [{ $ref: '#/definitions/scenes' }]
    } */
    const sceneArray = await scenes.find({})
    res.status(200).json(sceneArray)
})

routerScenes.get('/:name', async (req, res) => {
    // #swagger.tags = ['Сцены']
    // #swagger.summary = 'Получение сцены'
    /* #swagger.description = 'Возвращает объект, который является сценой' */
    /* #swagger.parameters['name'] = {
      description: 'Уникальное имя сцены',
      type: 'string',
      required: true
    } */
    /* #swagger.responses[200] = {
        description: 'OK',
        schema: { $ref: '#/definitions/scenes'  }
    } */
    /* #swagger.responses[400] = {
        description: 'Сцена с таким именем не найдена'
    } */
    const findScene = await scenes.findOne({ name: req.params.name })
    if (!findScene) {
        res.status(400).json({ message: 'Сцена с таким именем не найдена' })
    } else {
        res.status(200).json(findScene)
    }
})

routerScenes.put('/:name', async (req, res) => {
    // #swagger.tags = ['Сцены']
    // #swagger.summary = 'Редактирование сцены'
    /* #swagger.description = 'Редактирует сцену с опрделенным именем' */
    /* #swagger.parameters['name'] = {
      description: 'Уникальное имя сцены',
      type: 'string',
      required: true
    } */
    /* #swagger.parameters[''] = {
      in: 'body',
      description: 'Данные сцены, которые надо заменить',
      required: true,
      schema: { $ref: '#/definitions/scenes' }
    } */
    /* #swagger.responses[200] = {
        description: 'Сцена изменена',
    } */
    /* #swagger.responses[400] = {
        description: 'Редактируемая сцена с таким именем не найдена / Отсутсвует информация для редактирования'
    } */
    /* #swagger.responses[500] = {
        description: 'Сцена не изменена'
    } */
    const editScene = await scenes.findOne({ name: req.params.name })
    if (!editScene) {
        res.status(400).json({ message: 'Редактируемая сцена с таким именем не найдена' })
    }
    if (!req.body) {
        res.status(400).json({ message: 'Отсутсвует информация для редактирования' })
    }

    delete req.body.name
    await Object.assign(editScene, req.body)

    const resSave = await editScene.save()
    if (!resSave) {
        res.status(500).json({ message: 'Сцена не изменена' })
    } else {
        res.status(200).json({ message: 'Сцена изменена' })
    }
})

routerScenes.post('/', async (req, res, next) => {
    // #swagger.tags = ['Сцены']
    // #swagger.summary = 'Создание сцены'
    /* #swagger.description = 'Создает новую' */
    /* #swagger.parameters[''] = {
      in: 'body',
      description: 'Данные создаваемой сцены',
      required: true,
      schema: { $ref: '#/x-post-parameters/scenes' }
    } */
    /* #swagger.responses[200] = {
        description: 'Сцена создана',
    } */
    /* #swagger.responses[400] = {
        description: 'Сцена с таким именем уже существует / Нельзя создавать сцену без имени'
    } */
    /* #swagger.responses[500] = {
        description: 'Сцена не создана'
    } */
    if (!req.body.name) {
        res.status(400).json({ message: 'Нельзя создавать сцену без имени' })
        return next()
    }
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
            res.status(500).json({ message: 'Сцена не создана' })
        } else {
            res.status(200).json({ message: 'Сцена создана' })
        }
    } else
        res.status(400).json({ message: 'Сцена с таким именем уже существует' })
})

routerScenes.delete('/', async (req, res) => {
    // #swagger.tags = ['Сцены']
    // #swagger.summary = 'Удаление всех сцен'
    /* #swagger.description = 'Удаляет все сцены' */
    /* #swagger.responses[200] = {
        description: 'Все сцены удалены'
    } */
    await scenes.deleteMany({})
    res.status(200).json({ message: 'Все сцены удалены' })

})

routerScenes.delete('/:name', async (req, res) => {
    // #swagger.tags = ['Сцены']
    // #swagger.summary = 'Удаление сцены'
    /* #swagger.description = 'Удаление сцены с определенным именем' */
    /* #swagger.parameters['name'] = {
      description: 'Уникальное имя сцены',
      type: 'string',
      required: true
    } */
    /* #swagger.responses[200] = {
        description: 'Сцена удалена'
    } */
    /* #swagger.responses[400] = {
        description: 'Удаляемая сцена с таким именем не найдена'
    } */
    const deleteScene = await scenes.findOne({ name: req.params.name })

    if (!deleteScene) {
        res.status(400).json({ message: 'Удаляемая сцена с таким именем не найдена' })
    } else {
        await scenes.deleteOne({ name: req.params.name })
        res.status(200).json({ message: 'Сцена удалена' })
    }
})

export default routerScenes