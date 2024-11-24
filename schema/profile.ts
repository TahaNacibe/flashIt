import mongoose, { Schema, Document } from "mongoose";

interface ProfileDocument extends Document {
  userId: mongoose.Types.ObjectId;
  flash_cards: Array<any>;
  user_collections: Array<any>;
  up_votes_count: Array<any>;
  saved_flash_cards: Array<any>;
}

const ProfileSchema = new Schema<ProfileDocument>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  flash_cards:  [{type:mongoose.Schema.Types.ObjectId, ref:"FlashCard"}],
  up_votes_count: { type: [String], default: [] },
  user_collections: [{type:mongoose.Schema.Types.ObjectId, ref:"CollectionItem"}],
  saved_flash_cards: { type: [String], default: [] },
});

export default mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
