import rateLimit from 'express-rate-limit';
import express from 'express';
import cors from 'cors';
import convertRouter from './routes/convert.js';

const app = express();

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
    message: { error: 'You have made too many requests, please wait a bit.' }
});

app.use(limiter);

app.use('/convert', convertRouter);

export default app;
