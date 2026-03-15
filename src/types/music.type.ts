import { Document, Types } from "mongoose";

export interface IComment {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  text: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMusic extends Document {
  title: string;
  artist: string;
  album: string;
  genre: string;
  releaseDate: Date;
  musicUrl: string;
  duration: number;
  coverImageUrl: string;
  lyrics?: string;
  likes: Types.Array<Types.ObjectId>;
  comments: Types.DocumentArray<IComment>;
  createdAt: Date;
  updatedAt: Date;
}

export interface LikeBody {
  userId: string;
}
export interface CommentBody {
  userId: string;
  text: string;
}
