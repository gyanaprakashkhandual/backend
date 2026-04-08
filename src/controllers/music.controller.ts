import mongoose, { Types } from "mongoose";
import Music from "../models/music.model.js";

const isValidId = (id: string) => mongoose.Types.ObjectId.isValid(id);

/** GET /api/music — fetch all tracks sorted newest first */
export const getAllMusic = async (req: any, res: any) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [music, total] = await Promise.all([
      Music.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Music.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      message: "Music fetched successfully",
      data: music,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message ?? "Server error" });
  }
};
/** GET /api/music/:id — fetch a single track by ID */
export const getMusicById = async (req: any, res: any) => {
  try {
    const music = await Music.findById(req.params.id);
    if (!music) {
      res.status(404).json({
        success: false,
        message: `Music with ID '${req.params.id}' not found`,
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Music fetched successfully",
      data: music,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message ?? "Server error" });
  }
};

/** POST /api/music — create a new track */
export const createMusic = async (req: any, res: any) => {
  try {
    const music = await Music.create(req.body);
    res.status(201).json({
      success: true,
      message: "Music created successfully",
      data: music,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message ?? "Server error" });
  }
};

/** PUT /api/music/:id — update a track by ID */
export const updateMusic = async (req: any, res: any) => {
  try {
    const music = await Music.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!music) {
      res.status(404).json({
        success: false,
        message: `Music with ID '${req.params.id}' not found`,
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Music updated successfully",
      data: music,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message ?? "Server error" });
  }
};

/** DELETE /api/music/:id — delete a track by ID */
export const deleteMusic = async (req: any, res: any) => {
  try {
    const music = await Music.findByIdAndDelete(req.params.id);
    if (!music) {
      res.status(404).json({
        success: false,
        message: `Music with ID '${req.params.id}' not found`,
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Music deleted successfully",
      data: music,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message ?? "Server error" });
  }
};

/** POST /api/music/:id/like — toggle like/unlike; body: { userId } */
export const toggleLike = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId || !isValidId(userId)) {
      res
        .status(400)
        .json({ success: false, message: "Valid userId is required" });
      return;
    }
    if (!isValidId(id)) {
      res
        .status(400)
        .json({ success: false, message: "Valid musicId is required" });
      return;
    }

    const music = await Music.findById(id);
    if (!music) {
      res.status(404).json({ success: false, message: "Music not found" });
      return;
    }

    const uid = new Types.ObjectId(userId);
    const liked = music.likes.some((l) => l.equals(uid));

    music.likes = liked
      ? (music.likes.filter(
          (l) => !l.equals(uid),
        ) as Types.Array<Types.ObjectId>)
      : ([...music.likes, uid] as Types.Array<Types.ObjectId>);

    await music.save();
    res.status(200).json({
      success: true,
      message: liked
        ? "Track unliked successfully"
        : "Track liked successfully",
      data: { count: music.likes.length, userLiked: !liked },
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message ?? "Server error" });
  }
};

/** GET /api/music/:id/likes — get like count; query: ?userId */
export const getLikes = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const userId = req.query.userId as string;

    if (!isValidId(id)) {
      res
        .status(400)
        .json({ success: false, message: "Valid musicId is required" });
      return;
    }

    const music = await Music.findById(id).select("likes");
    if (!music) {
      res.status(404).json({ success: false, message: "Music not found" });
      return;
    }

    const userLiked =
      userId && isValidId(userId)
        ? music.likes.some((l) => l.equals(new Types.ObjectId(userId)))
        : false;

    res.status(200).json({
      success: true,
      message: "Likes fetched successfully",
      data: { count: music.likes.length, userLiked },
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message ?? "Server error" });
  }
};

/** POST /api/music/:id/comments — add a comment; body: { userId, text } */
export const addComment = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const { userId, text } = req.body;

    if (!userId || !isValidId(userId)) {
      res
        .status(400)
        .json({ success: false, message: "Valid userId is required" });
      return;
    }
    if (!isValidId(id)) {
      res
        .status(400)
        .json({ success: false, message: "Valid musicId is required" });
      return;
    }
    if (!text?.trim()) {
      res
        .status(400)
        .json({ success: false, message: "Comment text is required" });
      return;
    }
    if (text.trim().length > 1000) {
      res
        .status(400)
        .json({ success: false, message: "Comment exceeds 1000 characters" });
      return;
    }

    const music = await Music.findById(id);
    if (!music) {
      res.status(404).json({ success: false, message: "Music not found" });
      return;
    }

    music.comments.push({
      userId: new Types.ObjectId(userId),
      text: text.trim(),
    } as any);
    await music.save();

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: music.comments[music.comments.length - 1],
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message ?? "Server error" });
  }
};

/** GET /api/music/:id/comments — paginated comments; query: ?page&limit */
export const getComments = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      res
        .status(400)
        .json({ success: false, message: "Valid musicId is required" });
      return;
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const music = await Music.findById(id).select("comments");
    if (!music) {
      res.status(404).json({ success: false, message: "Music not found" });
      return;
    }

    const sorted = [...music.comments].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );
    const total = sorted.length;
    const paginated = sorted.slice(skip, skip + limit);

    res.status(200).json({
      success: true,
      message: "Comments fetched successfully",
      data: paginated,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message ?? "Server error" });
  }
};

/** PATCH /api/music/:id/comments/:commentId — edit own comment; body: { userId, text } */
export const updateComment = async (req: any, res: any) => {
  try {
    const { id, commentId } = req.params;
    const { userId, text } = req.body;

    if (!userId || !isValidId(userId)) {
      res
        .status(400)
        .json({ success: false, message: "Valid userId is required" });
      return;
    }
    if (!isValidId(id) || !isValidId(commentId)) {
      res.status(400).json({
        success: false,
        message: "Valid musicId and commentId are required",
      });
      return;
    }
    if (!text?.trim()) {
      res
        .status(400)
        .json({ success: false, message: "Comment text is required" });
      return;
    }

    const music = await Music.findById(id);
    if (!music) {
      res.status(404).json({ success: false, message: "Music not found" });
      return;
    }

    const comment = music.comments.id(commentId);
    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }
    if (comment.userId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "You can only edit your own comments",
      });
      return;
    }

    comment.text = text.trim();
    comment.updatedAt = new Date();
    await music.save();

    res.status(200).json({
      success: true,
      message: "Comment updated successfully",
      data: comment,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message ?? "Server error" });
  }
};

/** DELETE /api/music/:id/comments/:commentId — delete own comment; query: ?userId */
export const deleteComment = async (req: any, res: any) => {
  try {
    const { id, commentId } = req.params;
    const userId = req.query.userId as string;

    if (!userId || !isValidId(userId)) {
      res.status(400).json({
        success: false,
        message: "Valid userId query param is required",
      });
      return;
    }
    if (!isValidId(id) || !isValidId(commentId)) {
      res.status(400).json({
        success: false,
        message: "Valid musicId and commentId are required",
      });
      return;
    }

    const music = await Music.findById(id);
    if (!music) {
      res.status(404).json({ success: false, message: "Music not found" });
      return;
    }

    const comment = music.comments.id(commentId);
    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }
    if (comment.userId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "You can only delete your own comments",
      });
      return;
    }

    comment.deleteOne();
    await music.save();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: null,
    });
  } catch (err: any) {
    res
      .status(500)
      .json({ success: false, message: err.message ?? "Server error" });
  }
};
