import mongoose, { model, models, Schema, Document } from "mongoose";

const flashCardSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  parentCollection: { type: mongoose.Schema.Types.ObjectId, ref: "Collections" },
  selectedLanguage: { type: String, required: true },
  selectedDifficulty: { type: String, required: true },
  questions: {
    type: [
      {
        question: { type: String, required: true },
        options: { type: [String], required: true },
        correctOption: { type: Number, required: true },
      },
    ],
    required: true,
  },
},{timestamps: true});

const FlashCard = models.FlashCard || model("FlashCard", flashCardSchema);
export default FlashCard;
