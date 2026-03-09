import { Schema } from "mongoose";
import { IMusic } from "../types/music.type.js";

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
  },
  {
    timestamps: true,
  },
);

export default musicSchema;