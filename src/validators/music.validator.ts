import { body, param } from 'express-validator';

export const createMusicValidator = [
  body('title').notEmpty().withMessage('Title is required').isString(),
  body('artist').notEmpty().withMessage('Artist is required').isString(),
  body('album').notEmpty().withMessage('Album is required').isString(),
  body('genre').notEmpty().withMessage('Genre is required').isString(),
  body('releaseDate').notEmpty().withMessage('Release date is required').isISO8601().withMessage('Invalid date format'),
  body('duration').notEmpty().withMessage('Duration is required').isNumeric().withMessage('Duration must be a number'),
  body('coverImageUrl').notEmpty().withMessage('Cover image URL is required').isURL().withMessage('Invalid URL'),
  body('lyrics').optional().isString(),
];

export const updateMusicValidator = [
  param('id').isMongoId().withMessage('Invalid music ID'),
  body('title').optional().isString(),
  body('artist').optional().isString(),
  body('album').optional().isString(),
  body('genre').optional().isString(),
  body('releaseDate').optional().isISO8601().withMessage('Invalid date format'),
  body('duration').optional().isNumeric().withMessage('Duration must be a number'),
  body('coverImageUrl').optional().isURL().withMessage('Invalid URL'),
  body('lyrics').optional().isString(),
];

export const musicIdValidator = [
  param('id').isMongoId().withMessage('Invalid music ID'),
];