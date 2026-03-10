import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    createGownCollection,
    getMyGownCollection,
    updateGownSize
} from '../controllers/gownCollectionController.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// Student gown collection routes
router.post('/', createGownCollection);
router.put('/', createGownCollection);
router.get('/my-collection', getMyGownCollection);
router.patch('/:id', updateGownSize);

export default router;
