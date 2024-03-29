import routerScenes from '../router/scenes.js'
import bodyParser from 'body-parser'
import chai from 'chai'
import chaiHttp from 'chai-http'
import express from 'express'
// import { db } from '../db.js'
import scenes from '../models/scenes.js'

// жопа

const expect = chai.expect
chai.use(chaiHttp)

const app = express()
app.use(bodyParser.json())
app.use('/', routerScenes)

describe('Тесты /scenes', () => {
    beforeEach(async () => {
        await scenes.insertMany([
            {
                name: 'test1',
                image: '~/myaap/images/test1.png',
                text: 'its test 1',
                linkArray: [
                    {
                        text: 'next test',
                        nextScene: 'test2'
                    }
                ]
            },
            {
                name: 'test2',
                image: '~/myaap/images/test2.png',
                text: 'its test number 2',
                linkArray: [
                    {
                        text: 'back to start',
                        nextScene: 'test1'
                    }
                ]
            }
        ])
    })

    afterEach(async () => {
        await scenes.deleteMany({})
    })

    it('Ping', (done) => {
        chai
            .request(app)
            .get('/ping')
            .end((err, res) => {
                expect(err).to.be.null
                expect(res).to.have.status(200)
                expect(res.body).to.haveOwnProperty('pong')
                expect(res.body.pong).to.equal(true)
                done()
            })
    })
    describe('Тесты get', () => {
        it('get/scenes ERR', (done) => {
            chai
                .request(app)
                .get('/max')
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.have.own.property('message')
                    expect(res.body.message).to.eql('Сцена с таким именем не найдена')

                    done()
                })
        })

        it('get/scenes all', (done) => {
            chai
                .request(app)
                .get('/')
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('array')
                    expect(res.body[0]).to.be.an('object')
                    expect(res.body[0]).to.have.own.property('name')
                    expect(res.body[0].name).to.equal('test1')
                    expect(res.body[0]).to.have.own.property('text')
                    expect(res.body[0].text).to.equal('its test 1')
                    expect(res.body[0]).to.have.own.property('image')
                    expect(res.body[0].image).to.equal('~/myaap/images/test1.png')
                    expect(res.body[0]).to.have.own.property('linkArray')
                    expect(res.body[0].linkArray).be.an('array')

                    expect(res.body[0].linkArray[0]).to.be.an('object')
                    expect(res.body[0].linkArray[0]).to.have.own.property('text')
                    expect(res.body[0].linkArray[0].text).to.equal('next test')
                    expect(res.body[0].linkArray[0]).to.have.own.property('nextScene')
                    expect(res.body[0].linkArray[0].nextScene).to.equal('test2')

                    expect(res.body[1]).to.be.an('object')
                    expect(res.body[1]).to.have.own.property('name')
                    expect(res.body[1].name).to.equal('test2')
                    expect(res.body[1]).to.have.own.property('text')
                    expect(res.body[1].text).to.equal('its test number 2')
                    expect(res.body[1]).to.have.own.property('image')
                    expect(res.body[1].image).to.equal('~/myaap/images/test2.png')
                    expect(res.body[1]).to.have.own.property('linkArray')
                    expect(res.body[1].linkArray).be.an('array')

                    expect(res.body[1].linkArray[0]).to.be.an('object')
                    expect(res.body[1].linkArray[0]).to.have.own.property('text')
                    expect(res.body[1].linkArray[0].text).to.equal('back to start')
                    expect(res.body[1].linkArray[0]).to.have.own.property('nextScene')
                    expect(res.body[1].linkArray[0].nextScene).to.equal('test1')

                    done()
                })
        })
        it('get/scenes:name', (done) => {
            chai
                .request(app)
                .get('/test1')
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.own.property('name')
                    expect(res.body.name).to.equal('test1')
                    expect(res.body).to.have.own.property('text')
                    expect(res.body.text).to.equal('its test 1')
                    expect(res.body).to.have.own.property('image')
                    expect(res.body.image).to.equal('~/myaap/images/test1.png')
                    expect(res.body).to.have.own.property('linkArray')
                    expect(res.body.linkArray).be.an('array')

                    expect(res.body.linkArray[0]).to.be.an('object')
                    expect(res.body.linkArray[0]).to.have.own.property('text')
                    expect(res.body.linkArray[0].text).to.equal('next test')
                    expect(res.body.linkArray[0]).to.have.own.property('nextScene')
                    expect(res.body.linkArray[0].nextScene).to.equal('test2')

                    done()
                })
        })
    })
    describe('Тесты delete', () => {
        it('delete/scenes ERR', (done) => {
            chai
                .request(app)
                .delete('/max')
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.have.own.property('message')
                    expect(res.body.message).to.eql('Удаляемая сцена с таким именем не найдена')

                    done()
                })
        })
        it('delete/scenes', async () => {

            const res = await chai
                .request(app)
                .delete('/test1')
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.own.property('message')
            expect(res.body.message).to.equal('Сцена удалена')

            const scene = await scenes.findOne({ name: "test1" }).lean()
            expect(scene).to.be.an('null')
        })
        it('delete/scenes all', (done) => {
            chai
                .request(app)
                .delete('/')
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.own.property('message')
                    expect(res.body.message).to.eql('Все сцены удалены')

                    done()
                })
        })
    })
    describe('Тесты put', () => {
        it('put', async () => {

            const res = await chai
                .request(app)
                .put('/test1')
                .send({
                    name: "test1",
                    text: "its edit test 1",
                    image: "/home/molneva/myapp/picture/bg/editTest1.png",
                    linkArray: [
                        {
                            text: "GoToEditTest2",
                            nextScene: "editTest2"
                        }
                    ]
                })
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.own.property('message')
            expect(res.body.message).to.equal('Сцена изменена')

            const scene = await scenes.findOne({ name: "test1" }).lean()
            expect(scene).to.be.an('object')
            expect(scene).to.have.own.property('name')
            expect(scene.name).to.equal('test1')
            expect(scene).to.have.own.property('text')
            expect(scene.text).to.equal('its edit test 1')
            expect(scene).to.have.own.property('image')
            expect(scene.image).to.equal('/home/molneva/myapp/picture/bg/editTest1.png')
            expect(scene).to.have.own.property('linkArray')
            expect(scene.linkArray).be.an('array')

            expect(scene.linkArray[0]).to.be.an('object')
            expect(scene.linkArray[0]).to.have.own.property('text')
            expect(scene.linkArray[0].text).to.equal('GoToEditTest2')
            expect(scene.linkArray[0]).to.have.own.property('nextScene')
            expect(scene.linkArray[0].nextScene).to.equal('editTest2')

        })

        it('put ERR NO NAME', (done) => {
            chai
                .request(app)
                .put('/max')
                //.set('X-API-Key', 'foobar')
                .send({
                    name: "test1",
                    text: "editTest1",
                    image: "/home/molneva/myapp/picture/bg/editTest1.png",
                    linkArray: [
                        {
                            text: "GoToEditTest2",
                            nextScene: "editTest2"
                        }
                    ]
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.have.own.property('message')
                    expect(res.body.message).to.eql('Редактируемая сцена с таким именем не найдена')
                    done()
                })
        })
        it('put ERR NO BODY', (done) => {
            chai
                .request(app)
                .put('/test1')
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.have.own.property('message')
                    expect(res.body.message).to.eql('Отсутсвует информация для редактирования')
                    done()
                })
        })
    })
    describe('Тесты post', () => {

        it('post ', async () => {

            const res = await chai
                .request(app)
                .post('/')
                .send({
                    "name": "test3",
                    "text": "test3",
                    "image": "/home/molneva/myapp/picture/bg/test3.png",
                    "linkArray": [
                        {
                            "text": "GoToTest1",
                            "nextScene": "test1"
                        }
                    ]
                })
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.own.property('message')
            expect(res.body.message).to.equal('Сцена создана')

            const scene = await scenes.findOne({ name: "test3" }).lean()
            expect(scene).to.be.an('object')
            expect(scene).to.have.own.property('name')
            expect(scene.name).to.equal('test3')
            expect(scene).to.have.own.property('text')
            expect(scene.text).to.equal('test3')
            expect(scene).to.have.own.property('image')
            expect(scene.image).to.equal('/home/molneva/myapp/picture/bg/test3.png')
            expect(scene).to.have.own.property('linkArray')
            expect(scene.linkArray).be.an('array')

            expect(scene.linkArray[0]).to.be.an('object')
            expect(scene.linkArray[0]).to.have.own.property('text')
            expect(scene.linkArray[0].text).to.equal('GoToTest1')
            expect(scene.linkArray[0]).to.have.own.property('nextScene')
            expect(scene.linkArray[0].nextScene).to.equal('test1')
        })
        it('post ERR NO NAME', (done) => {
            chai
                .request(app)
                .post('/')
                .type('form')
                .send({
                    "text": "test3",
                    "image": "/home/molneva/myapp/picture/bg/test3.png",
                    "linkArray": [
                        {
                            "text": "GoToTest1",
                            "nextScene": "Test1"
                        }
                    ]
                })
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.have.own.property('message')
                    expect(res.body.message).to.eql('Нельзя создавать сцену без имени')
                    done()
                })
        })

        it('post ERR  NAME EXISTS', async () => {

            const res = await chai
                .request(app)
                .post('/')
                .send({
                    "name": "test1",
                    "text": "test3",
                    "image": "/home/molneva/myapp/picture/bg/test3.png",
                    "linkArray": [
                        {
                            "text": "GoToTest1",
                            "nextScene": "Test1"
                        }
                    ]
                })
            expect(res).to.have.status(400)
            expect(res.body).to.be.an('object')
            expect(res.body).to.have.own.property('message')
            expect(res.body.message).to.equal('Сцена с таким именем уже существует')

        })
    })
})
