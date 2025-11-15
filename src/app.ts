import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { globalErrHandler } from './app/middlewares/globalErrHandler';
import { notFound } from './app/middlewares/notFound';
import router from './app/routes';
const app: Application = express();

// parsers
app.use(express.json());

const allowedOrigins = [
  'http://localhost:3000',
  'https://gadgetoria.vercel.app',
]; // frontend URL

app.use(
  cors({
    origin: allowedOrigins, // must be explicit, not '*'
    credentials: true, // allow cookies and credentials
  }),
);

// application routes
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// global error handler
app.use(globalErrHandler);

// not found
app.use(notFound);

export default app;
