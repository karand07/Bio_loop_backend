import 'dotenv/config';
import express from 'express';
const app = express();
const port = 3000;
import mongoose from 'mongoose';
import {farmerRouter} from './routers/farmer.js'
import {companyRouter} from './routers/company.js'
app.use(express.json());
app.use('/famer',farmerRouter);
app.use('/company',companyRouter);

async function main(){
    await mongoose.connect(process.env.MONGO_URL)
    app.listen(3000,()=>console.log(`server is running on the port ${port}`))
}
main();