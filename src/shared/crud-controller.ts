import { Request, Response } from 'express';
import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config';

type CollectionName = 'artists' | 'albums' | 'playlists' | 'tracks';

export class CrudController<T extends Document> {
  private client: MongoClient;
  private dbUri: string;
  private dbName: string;
  private collectionName: CollectionName;
  private model: Model<T>;

  constructor(collectionName: CollectionName, model: Model<T>) {
    this.dbUri = process.env.DB_URI || '';
    this.dbName = process.env.DB_NAME || '';
    this.collectionName = collectionName;
    this.model = model;
    this.client = new MongoClient(this.dbUri);
  }

  private async connectToDatabase() {
    await this.client.connect();
    return this.client.db(this.dbName).collection(this.collectionName);
  }

  public create = async (req: Request, res: Response) => {
    try {
      const collection = await this.connectToDatabase();
      const item = new this.model(req.body);
      await collection.insertOne(item);
      res.status(201).json(item);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    } finally {
      await this.client.close();
    }
  };

  public getAll = async (req: Request, res: Response) => {
    const defaultPage = 1;
    const defaultCount = 10;

    try {
      const collection = await this.connectToDatabase();
      const page = parseInt(req.query.page as string) || defaultPage;
      const count = parseInt(req.query.count as string) || defaultCount;
      const skip = page === 1 ? 0 : (page - 1) * count;

      const totalItems = await collection.countDocuments();
      const data = await collection.find().skip(skip).limit(count).toArray();

      const response = {
        page,
        data,
        totalItems,
        totalPages: Math.ceil(totalItems / count),
      };

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    } finally {
      await this.client.close();
    }
  };

  public getById = async (req: Request, res: Response) => {
    try {
      const collection = await this.connectToDatabase();
      const item = await collection.findOne({
        _id: new ObjectId(req.params.id),
      });
      if (!item) {
        return res.status(404).json({ error: `${this.model.modelName} not found` });
      }
      res.status(200).json(item);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    } finally {
      await this.client.close();
    }
  };

  public update = async (req: Request, res: Response) => {
    try {
      const collection = await this.connectToDatabase();
      const filter: FilterQuery<T> = { _id: new ObjectId(req.params.id) };
      const updateDoc: UpdateQuery<T> = { $set: req.body };
      const item = await collection.findOneAndUpdate(filter, updateDoc);
      if (!item.value) {
        return res.status(404).json({ error: `${this.model.modelName} not found` });
      }
      res.status(200).json(item.value);
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    } finally {
      await this.client.close();
    }
  };

  public remove = async (req: Request, res: Response) => {
    try {
      const collection = await this.connectToDatabase();
      const result = await collection.findOneAndDelete({
        _id: new ObjectId(req.params.id),
      });
      if (!result.value) {
        return res.status(404).json({ error: `${this.model.modelName} not found` });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
    } finally {
      await this.client.close();
    }
  };
}
