import express, { Router } from 'express';
import {
  getAllMusic,
  getMusicById,
  createMusic,
  updateMusic,
  deleteMusic,
} from '../controllers/music.controller.js';
import {
  createMusicValidator,
  updateMusicValidator,
  musicIdValidator,
} from '../validators/music.validator.js';
import { handleValidationErrors, logRequest } from '../middlewares/music.middleware.js';

const router: Router = express.Router();

router.use(logRequest);

// GET /api/music
router.get('/', getAllMusic);

// GET /api/music/:id
router.get('/:id', musicIdValidator, handleValidationErrors, getMusicById);

// POST /api/music
router.post('/', createMusicValidator, handleValidationErrors, createMusic);

// PUT /api/music/:id
router.put('/:id', updateMusicValidator, handleValidationErrors, updateMusic);

// DELETE /api/music/:id
router.delete('/:id', musicIdValidator, handleValidationErrors, deleteMusic);

export default router;