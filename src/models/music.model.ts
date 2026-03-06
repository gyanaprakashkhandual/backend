import mongoose from "mongoose";
import musicSchema from "../schemas/music.schema";
import { IMusic } from "../types/music.type";

const Music = mongoose.model<IMusic>("Music", musicSchema);

export default Music;
