import mongoose, { Schema, models } from 'mongoose'

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: { type: String, unique: true, required: true, index: true, dropDups: true },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: String
  },
  pictureUrl: {
    type: String
  }
}, { timestamps: true })

const User = models.User || mongoose.model('User', userSchema)
export default User
