import routerScenes from '../router/scenes.js'
import chai from 'chai'
import chaiHttp from 'chai-http'
import express from 'express'
// import { db } from '../db.js'
import scenes from '../models/scenes.js'

const expect = chai.expect
chai.use(chaiHttp)

const app = express()
// app.get('/ping', (req, res) => res.json({ pong: true }))
// app.use(passport.initialize())
// app.use(passport.session())
app.use('/', routerScenes)

describe('Тесты /scenes', () => {
    beforeEach(async () => {
        console.log(process.env.MONGO_DB)

        await scenes.insertMany([
            {
                name: 'test1',
                image: '~/myaap/images/test1.png',
                text: 'its test',
                linkArray: [
                    {
                        text: 'next test',
                        nextScene: 'test2'
                    }
                ]
            },
            {
                name: 'test2',
                image: '~/myaap/images/test1.png',
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

    // afterEach(async () => {
    //     await scenes.deleteMany({})
    // })

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

                    expect(res.body[1]).to.be.an('object')
                    expect(res.body[1]).to.have.own.property('name')
                    expect(res.body[1].name).to.equal('test2')

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
        it('delete/scenes', (done) => {
            chai
                .request(app)
                .delete('/test1')
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(200)
                    expect(res.body).to.have.own.property('message')
                    expect(res.body.message).to.eql('Сцена удалена')
                    done()
                })
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
        it('put', (done) => {
            chai
                .request(app)
                .put('/test1')
                .set('Content-Type', 'application/json')
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
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.own.property('name')
                    expect(res.body.name).to.equal('test1')
                    expect(res.body).to.have.own.property('text')
                    expect(res.body.name).to.equal('editTest1')
                    done()
                })
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
                //.set('X-API-Key', 'foobar')
                .send({
                })
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
        it('post ', (done) => {
            chai
                .request(app)
                .post('/')
                //.set('X-API-Key', 'foobar')
                .send({
                    "name": "test3",
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
                    expect(res).to.have.status(200)
                    expect(res.body).to.be.an('object')
                    expect(res.body).to.have.own.property('name')
                    expect(res.body.name).to.equal('test3')
                    expect(res.body).to.have.own.property('text')
                    expect(res.body.name).to.equal('test3')
                    done()
                })
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

        it('post ERR  NAME EXISTS', (done) => {
            chai
                .request(app)
                .post('/')
                .type('form')
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
                .end((err, res) => {
                    expect(err).to.be.null
                    expect(res).to.have.status(400)
                    expect(res.body).to.have.own.property('message')
                    expect(res.body.message).to.eql('Сцена с таким именем уже существует')
                    done()
                })
        })
    })
})
