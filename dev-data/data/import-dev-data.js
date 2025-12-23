import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Tour } from '../../models/modelsExport.js';
dotenv.config({ path: './config.env' });

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// console.log(process.env.NODE_ENV); // now it will print "development"
const db = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connected successful'));

// read json file
const tours = JSON.parse(
    fs.readFileSync(resolve(__dirname, 'tours-simple.json'), 'utf-8')
  );

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('documents loaded successfully...');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log('documents erased...');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const argvType = process.argv[2];
if (argvType === '--import') {
  importData();
} else if (argvType === '--delete') {
  deleteData();
}

// dev-data/data/import-dev-data.js --delete
// dev-data/data/import-dev-data.js --import