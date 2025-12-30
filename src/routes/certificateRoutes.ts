import { Router } from 'express';
import { createCertificate, getAllCertificates, verify } from '../controllers/certificateController';

const router = Router();

router.get('/certificates', getAllCertificates);
router.post('/certificates', createCertificate);
router.get('/certificates/verify/:id', verify);

export default router;