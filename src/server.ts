import app from './app';
import dotenv from 'dotenv';
dotenv.config();

const PORT: number = parseInt(process.env.PORT!) || 3000;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
