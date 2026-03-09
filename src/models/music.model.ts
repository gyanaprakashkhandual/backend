import mongoose from "mongoose";
import musicSchema from "../schemas/music.schema.js";
import { IMusic } from "../types/music.type.js";

const Music = mongoose.model<IMusic>("Music", musicSchema);

export default Music;
