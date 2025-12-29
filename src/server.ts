import express, { Request, Response } from 'express';
import userRoutes from './routes/userRoutes';
import certificateRoutes from './routes/certificateRoutes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', certificateRoutes);

// Error Handling Middleware
app.use(errorHandler);

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, World!');
});

export default app; 