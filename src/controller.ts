import { Request, Response } from 'express';
import fs from 'fs/promises';

interface Data {
  organization: string;
  createdAt: Date;
  updatedAt?: Date;
  products: string[];
  marketValue: string;
  address: string;
  ceo: string;
  country: string;
  id: number;
  noOfEmployees: number;
  employees: string[];
}

const controller = () => {
  const readFile = async () => {
    try {
      const data = await fs.readFile('./database.json', 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error) {
        await fs.writeFile('./database.json', JSON.stringify([]));
        const data = await fs.readFile('./database.json', 'utf-8');
        return JSON.parse(data);
      }
    }
  };

  return {
    // Get all data
    getAll: async (req: Request, res: Response) => {
      try {
        let data = await readFile();
        res.status(200).json({ data: data });
      } catch (error) {
        if (error) return res.status(400).end('Bad Request');
      }
    },

    // Get single data
    getSingle: async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);

      if (!id) {
        return res.status(400).end('Bad Request');
      }

      const data = await readFile();
      for (let item of data) {
        if (item.id === id) {
          return res.status(200).json({ data: item });
        }
      }

      return res.status(404).end('Data with given id is not found');
    },

    // Post new data
    post: async (req: Request, res: Response) => {
      const data = req.body;

      if (Object.keys(data).length === 0) {
        return res.status(400).end('Bad Request');
      }

      const file = await readFile();
      const lastItem = file.length;

      if (!file) {
        data.id = 1;
      } else {
        data.id = lastItem + 1;
      }

      data.createdAt = new Date();
      file.push(data);
      await fs.writeFile('./database.json', JSON.stringify(file, null, 2));
      res.status(201).json({ data: data });
    },

    // Update data
    put: async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      const data = req.body;

      if (!id || !data) return res.status(400).end('Bad Request');

      data.updatedAt = new Date();
      const file = await readFile();
      let newData;
      file.forEach((item: Data) => {
        if (item.id === id) {
          newData = { ...item, ...data };
        }
      });

      if (!newData) return res.status(404).end('Data not found');
      file.push(newData);

      await fs.writeFile('./database.json', JSON.stringify(file, null, 2));
      res.status(200).json({ data: newData });
    },

    // Delete data
    del: async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      let data = await readFile();

      if (!id || !data) return res.status(400).end('Bad Request');

      const unwanted = data.find((item: Data) => item.id === id);

      if (!unwanted) return res.status(404).end('Data not found');

      data = data.filter((item: Data) => item.id !== id);
      await fs.writeFile('./database.json', JSON.stringify(data, null, 2));
      res.status(200).json({ data: unwanted[0] });
    },
  };
};

export default controller;
