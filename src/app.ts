import express, { Express, Request, Response } from 'express';
import controller from './controller';

const { getAll, getSingle, post, put, del } = controller();

const app: Express = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', async (req: Request, res: Response) => await getAll(req, res));
app.get(
  '/:id',
  async (req: Request, res: Response) => await getSingle(req, res)
);
app.post('/', async (req: Request, res: Response) => await post(req, res));
app.put('/:id', async (req: Request, res: Response) => await put(req, res));
app.delete('/:id', async (req: Request, res: Response) => await del(req, res));

export default app;
