import { Router } from 'express';
import { createCertificate, verify } from '../controllers/certificateController';

const router = Router();

router.post('/certificates', createCertificate);
router.get('/certificates/verify/:id', verify);

export default router;