import { Schema } from "mongoose";
import { IMusic, IComment } from "../types/music.type.js";

const CommentSchema = new Schema<IComment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "userId is required"],
    },
    text: {
      type: String,
      required: [true, "Comment text is required"],
      trim: true,
      minlength: [1, "Comment cannot be empty"],
      maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
  },
  { timestamps: true },
);

const musicSchema = new Schema<IMusic>(
  {
    title: { type: String, required: true },
    artist: { type: String, required: true },
    album: { type: String, required: true },
    genre: { type: String, required: true },
    releaseDate: { type: Date, required: true },
    musicUrl: { type: String, required: true },
    duration: { type: Number, required: true },
    coverImageUrl: { type: String, required: true },
    lyrics: { type: String },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    comments: { type: [CommentSchema], default: [] },
  },
  { timestamps: true, versionKey: false },
);

export default musicSchema;
