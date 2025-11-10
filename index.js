import 'dotenv/config';
import express from 'express';
const app = express();
const port = 3000;
import mongoose from 'mongoose';
import {farmerRouter} from './routers/farmer.js'
import {companyRouter} from './routers/company.js'
import { adminRouter } from './routers/admin.js';
import cors from 'cors';
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(express.json());
app.use('/farmer',farmerRouter);
app.use('/company',companyRouter);
app.use('/admin',adminRouter)

async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000,()=>console.log(`server is running on the port ${port}`))
}
main();