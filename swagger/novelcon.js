import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import swaggerAutogen from 'swagger-autogen'

const _dirname = dirname(fileURLToPath(import.meta.url))
console.log('~ _dirname', _dirname)

const doc = {
    // общая информация
    info: {
        title: 'NovelCon API',
        description: 'API for Novel Constructor'
    },
    // что-то типа моделей
    '@definitions': {
        scenes: {
            type: 'object',
            description: 'Описание отдельной сцены для новеллы',
            properties: {
                name: {
                    type: 'string',
                    readOnly: true,
                    description: 'Уникальный идентификатор сцены',
                    example: 'hello1'
                },
                text: {
                    type: 'string',
                    description: 'Авторское описание происходящих событий в сцене',
                    example: 'С вами поздоровался красивый программист'
                },
                image: {
                    type: 'string',
                    description: 'Адрес изображения для сцены на сервере',
                    example: '/home/molneva/myapp/images/hello1.png'
                },
                linkArray: {
                    type: 'array',
                    description: 'Массив вариантов ответов',
                    items: {
                        type: 'object',
                        description: 'Описание варианта ответа',
                        properties: {
                            text: {
                                type: 'string',
                                description: 'Текст ответа',
                                example: 'Сказать привет'
                            },
                            nextScene: {
                                type: 'string',
                                description: 'Имя сцены, которая последует при выборе данного ответа',
                                example: 'hello2'
                            }
                        }
                    }
                }
            }
        }
    },
    'x-post-parameters': {
        scenes: {
            type: 'object',
            description: 'Описание отдельной сцены для новеллы',
            properties: {
                name: {
                    type: 'string',
                    description: 'Уникальный идентификатор сцены',
                    example: 'hello1'
                },
                text: {
                    type: 'string',
                    description: 'Авторское описание происходящих событий в сцене',
                    example: 'С вами поздоровался красивый программист'
                },
                image: {
                    type: 'string',
                    description: 'Адрес изображения для сцены на сервере',
                    example: '/home/molneva/myapp/images/hello1.png'
                },
                linkArray: {
                    type: 'array',
                    description: 'Массив вариантов ответов',
                    items: {
                        type: 'object',
                        description: 'Описание варианта ответа',
                        properties: {
                            text: {
                                type: 'string',
                                description: 'Текст ответа',
                                example: 'Сказать привет'
                            },
                            nextScene: {
                                type: 'string',
                                description: 'Имя сцены, которая последует при выборе данного ответа',
                                example: 'hello2'
                            }
                        }
                    }
                }
            }
        }
    },
    host: '46.36.223.228:8280',
    schemes: ['http']
}

// путь и название генерируемого файла
const outputFile = join(_dirname, 'novelCon.json')
// массив путей к роутерам
const endpointsFiles = [join(_dirname, '../server.js')]

/* eslint-disable spaced-comment */
swaggerAutogen(/*options*/)(outputFile, endpointsFiles, doc).then(({ success }) => {
    console.log(`Generated: ${success}`)
})