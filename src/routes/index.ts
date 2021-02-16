import { Router } from 'express';
import V1Router from './v1';

// Init router and path
const router = Router();

// Add sub-routes
router.use('/v1', V1Router);

// Export the base-router
export default router;
