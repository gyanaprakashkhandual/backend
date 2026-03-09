import { Request, Response } from 'express';
import Music from '../models/music.model.js';

// GET all music
export const getAllMusic = async (req: Request, res: Response): Promise<void> => {
  try {
    const music = await Music.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Music fetched successfully',
      data: music,
      total: music.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      message: 'Error fetching music',
      error: errorMessage,
    });
  }
};

// GET single music by ID
export const getMusicById = async (req: Request, res: Response): Promise<void> => {
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
      message: 'Music fetched successfully',
      data: music,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      message: 'Error fetching music',
      error: errorMessage,
    });
  }
};

// POST create music
export const createMusic = async (req: Request, res: Response): Promise<void> => {
  try {
    const music = new Music(req.body);
    const saved = await music.save();

    res.status(201).json({
      success: true,
      message: 'Music created successfully',
      data: saved,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      message: 'Error creating music',
      error: errorMessage,
    });
  }
};

// PUT update music
export const updateMusic = async (req: Request, res: Response): Promise<void> => {
  try {
    const music = await Music.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    if (!music) {
      res.status(404).json({
        success: false,
        message: `Music with ID '${req.params.id}' not found`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Music updated successfully',
      data: music,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      message: 'Error updating music',
      error: errorMessage,
    });
  }
};

// DELETE music
export const deleteMusic = async (req: Request, res: Response): Promise<void> => {
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
      message: 'Music deleted successfully',
      data: music,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      success: false,
      message: 'Error deleting music',
      error: errorMessage,
    });
  }
};