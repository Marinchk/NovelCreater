import mongoose, { Schema } from "mongoose"


const sceneSchema = new Schema({
  name: String,
  image: String,
  text: String,
  linkArray: [
    {
      text: String,
      nextScene: String
    }
  ]
})

export default mongoose.model('scenes', sceneSchema)

// replica: [{
//   characterName: String,
//   speech: String,
//   characterPic: Buffer
// }],
// bg: Buffer



