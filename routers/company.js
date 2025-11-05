import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { companyModel,allocatedWasteModel, createWasteModel } from '../db.js';
import {companyAuth} from '../middleware/company.js'
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

companyRouter.use(companyAuth);

companyRouter.get('/wasteList',async (req,res)=>{
 const wasteList = await  createWasteModel.find({})
res.json({
    wasteList
})
})

companyRouter.post('/allocateWaste',async (req,res)=>{
    const companyId = req.companyId;
    const {wasteId,farmerId} = req.body;

    const allocatedWaste = await allocatedWasteModel.create({
        waste:wasteId,
        company:companyId,
        farmer:farmerId
    })
    res.json({
        message:'waste allocated successfully',
        allocatedWasteId:allocatedWaste._id
    })
})

export{companyRouter}