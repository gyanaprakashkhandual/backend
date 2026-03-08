import { Document, Types } from "mongoose";

export interface IMusic extends Document {
    title: String;
    artist: String;
    album: String;
    genre: String;
    releaseDate: Date;
    duration: Number;
    coverImageUrl: String;
    lyrics: String;
    musicUrl: String;
    createdAt: Date;
    updatedAt: Date;
}