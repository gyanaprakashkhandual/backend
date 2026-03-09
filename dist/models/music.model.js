import mongoose from "mongoose";
import musicSchema from "../schemas/music.schema.js";
const Music = mongoose.model("Music", musicSchema);
export default Music;
