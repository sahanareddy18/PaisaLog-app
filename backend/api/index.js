import app from '../app.js';
import { initDatabase } from '../db.js';

let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    await initDatabase();
    initialized = true;
  }

  return app(req, res);
}
