import express, { Router } from 'express';
import {
  getAllMusic,
  getMusicById,
  createMusic,
  updateMusic,
  deleteMusic,
} from '../controllers/music.controller.js';


const router: Router = express.Router();


// GET /api/music
router.get('/', getAllMusic);

// GET /api/music/:id
router.get('/:id',  getMusicById);

// POST /api/music
router.post('/',  createMusic);

// PUT /api/music/:id
router.put('/:id',updateMusic);

// DELETE /api/music/:id
router.delete('/:id',  deleteMusic);

export default router;