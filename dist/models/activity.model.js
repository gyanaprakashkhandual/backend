import mongoose, { Schema } from "mongoose";
import { ActivityType } from "../types/activity.type.js";
// ─── Comment sub-schema ──────────────────────────────────────────────────────
const CommentSchema = new Schema({
    text: {
        type: String,
        required: [true, "Comment text is required"],
        trim: true,
        minlength: [1, "Comment cannot be empty"],
        maxlength: [1000, "Comment cannot exceed 1000 characters"],
    },
}, {
    // Mongoose auto-manages createdAt / updatedAt on the sub-doc
    timestamps: true,
    _id: false, // no separate _id for the embedded comment
});
// ─── Activity schema ─────────────────────────────────────────────────────────
const ActivitySchema = new Schema({
    // Reference to the music track
    musicId: {
        type: Schema.Types.ObjectId,
        ref: "Music",
        required: [true, "musicId is required"],
        index: true,
    },
    // Reference to the user who performed the activity
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"],
        index: true,
    },
    // Activity type — "like" | "comment"
    type: {
        type: String,
        enum: {
            values: Object.values(ActivityType),
            message: `type must be one of: ${Object.values(ActivityType).join(", ")}`,
        },
        required: [true, "Activity type is required"],
    },
    // Populated only when type === "comment"
    comment: {
        type: CommentSchema,
        default: undefined,
    },
}, {
    timestamps: true, // adds createdAt + updatedAt at the top level
    versionKey: false,
});
// ─── Compound indexes ────────────────────────────────────────────────────────
// One like per user per track  (unique constraint)
ActivitySchema.index({ musicId: 1, userId: 1, type: 1 }, {
    unique: true,
    partialFilterExpression: { type: ActivityType.LIKE },
    name: "unique_like_per_user_per_track",
});
// Fast lookup: all activities for a track ordered by newest first
ActivitySchema.index({ musicId: 1, createdAt: -1 });
// Fast lookup: all activities by a user
ActivitySchema.index({ userId: 1, createdAt: -1 });
// ─── Model ────────────────────────────────────────────────────────────────────
const Activity = mongoose.model("Activity", ActivitySchema);
export default Activity;
