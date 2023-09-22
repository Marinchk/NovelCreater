import mongoose, { Schema } from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

const MONGO_USERNAME = process.env.MONGO_USERNAME
const MONGO_PASSWORD = process.env.MONGO_PASSWORD
const MONGO_HOSTNAME = process.env.MONGO_HOSTNAME
const MONGO_PORT = process.env.MONGO_PORT
const MONGO_DB = process.env.MONGO_DB || 'novel'

const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

mongoose.set('strictQuery', true)
export const db = mongoose.connect(url, { useNewUrlParser: true }, err => {
  if (!err) {
    console.log(`база данных ${MONGO_DB} загружена`)
  } else {
    console.log(`база данных ${MONGO_DB} не загружена`)
  }
})
