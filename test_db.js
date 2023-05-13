import mongoose, { Schema } from "mongoose"

const MONGO_USERNAME = 'molneva'
const MONGO_PASSWORD = 'QL7t7rVYWAxFuz6P0zp7'
const MONGO_HOSTNAME = '127.0.0.1'
const MONGO_PORT = '27017'
const MONGO_DB = 'novel'

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`



mongoose.set('strictQuery', true)
const db = mongoose.connect(url, { useNewUrlParser: true }, err => {
    if (!err) {
        console.log('база данных загружена')
    }
})


const testsSchema = new Schema({
    name: String,
    age: Number
})

const tests = mongoose.model('tests', testsSchema)
testPwd()

async function testPwd() {
    const result = await tests.findOne().lean()
    console.log(result)
}
