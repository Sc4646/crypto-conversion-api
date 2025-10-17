import dotenv from 'dotenv';
import express from 'express';
import convertRouter from './routes/convert.js';

dotenv.config();

const app = express();

app.use('/convert', convertRouter);

export default app;

if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on port ${PORT}`);
    });
}
