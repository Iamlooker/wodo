import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import todoRoutes from './routes/todos';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI || '')
    .then(() => console.log('MongoDB Connected'))
    .catch((err) => console.error(err));

app.use('/api/v1', todoRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
