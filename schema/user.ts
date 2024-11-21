import mongoose from 'mongoose'
import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
  // Existing NextAuth fields
  name: String,
  email: { type: String, required: true, unique: true },
  image: String,
  emailVerified: Date,

  // Custom fields
  flash_cards: { 
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FlashCard' }], 
    default: [] 
  },
  up_votes_count: { type: Number, default: 0 },
  saved_flash_cards: { 
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FlashCard' }], 
    default: [] 
  },
}, { 

    //* include time stamp and throw to handle any error, i don't know for real but that what the stack over flow said
  timestamps: true,
  strict: 'throw' 
})

// Ensure unique index on email
UserSchema.index({ email: 1 }, { unique: true })

const User = models.User || model('User', UserSchema)

export default User