import mongoose from "mongoose";

const { Schema, model } = mongoose;

const collectionsSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    description: {type: String},
    colorKey: { type: String, required: true },
    collection_cards: [
      { type: Schema.Types.ObjectId, ref: "FlashCard" }
    ],
  },
  { timestamps: true }
);

// Check if the model is already defined to prevent overwriting
const CollectionItem = mongoose.models.CollectionItem || model("CollectionItem", collectionsSchema);

export default CollectionItem;
