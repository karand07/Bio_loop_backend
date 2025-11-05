import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { companyModel,allocatedWasteModel } from '../db.js';

const COMPANY_SECRET= process.env.COMPANY_SECRET
const companyRouter = Router();

companyRouter.post('/signup',async(req,res)=>{
    const{companyName,companyEmail,companyPhone,companyPassword,companyStreet,companyVillage,companyPincode,companyBio} = req.body ;
    const companyExists = await companyModel.findOne({
        companyEmail:companyEmail
    });
    if(companyExists){
        return res.json('company Already Exists');
    }
    const hashedPass = await bcrypt.hash(companyPassword,3);
        await companyModel.create({
            companyName:companyName,
            companyEmail:companyEmail,
            companyPhone:companyPhone,
            companyPassword:hashedPass,
            companyStreet:companyStreet,
            companyVillage:companyVillage,
            companyPincode:companyPincode,
            companyBio:companyBio
        });
        res.json({
            messagage:'Company registered Succcessfully'
        })
})

companyRouter.post('/login',async(req,res)=>{
    const {companyEmail,companyPassword} = req.body

    const company = await companyModel.findOne({
        companyEmail:companyEmail
    });
    const hashedPass = await bcrypt.compare(companyPassword,company.companyPassword)
    if(company&& hashedPass){
        const token = jwt.sign({
            id: company._id
        },COMPANY_SECRET)
        res.json({
            messagage:'login succesfull',
            token:token
        })
    }else{
        res.json({
            messagage:'Enter correct Crediantials '
        })
    }
})





export{companyRouter}