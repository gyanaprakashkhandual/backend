import { Document, Types } from "mongoose";

// ─── Enum: supported activity types ────────────────────────────────────────
export enum ActivityType {
  LIKE    = "like",
  COMMENT = "comment",
}

// ─── Sub-type: comment payload ──────────────────────────────────────────────
export interface IComment {
  text:      string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Core activity interface ─────────────────────────────────────────────────
export interface IActivity extends Document {
  /** The music track this activity belongs to */
  musicId:      Types.ObjectId;

  /** The user who performed the activity */
  userId:       Types.ObjectId;

  /** What kind of activity this is */
  type:         ActivityType;

  /** Present only when type === "comment" */
  comment?:     IComment;

  createdAt:    Date;
  updatedAt:    Date;
}

// ─── Request body types ──────────────────────────────────────────────────────

export interface LikeMusicBody {
  userId:  string;
  musicId: string;
}

export interface CommentMusicBody {
  userId:  string;
  musicId: string;
  text:    string;
}

export interface UpdateCommentBody {
  text: string;
}

// ─── API response shapes ─────────────────────────────────────────────────────

export interface ActivityResponse {
  success: boolean;
  message: string;
  data?:   IActivity | IActivity[] | null;
  total?:  number;
}