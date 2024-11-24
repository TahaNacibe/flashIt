import mongoose, { model, models, Schema, Document } from "mongoose";
import { unique } from "next/dist/build/utils";

const flashCardSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  up_Votes: [String], default:[],
  parentCollection: { type: mongoose.Schema.Types.ObjectId, ref: "Collections" },
  selectedLanguage: { type: String, required: true },
  selectedDifficulty: { type: String, required: true },
  rankingBoard: {
    type: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique:true },
        clearTimeInSeconds: { type: Number, required: true },
        numberOfCorrectAnswers: { type: Number, required: true },
      },
    ],
    default: [],
  },
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
