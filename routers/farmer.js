import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { farmerModel } from '../db.js';
const FARMER_SECRET =process.env.FARMER_SECRET
const farmerRouter = Router()

farmerRouter.post('/signup',async(req,res)=>{
    const {farmerName,farmerEmail,farmerPhone,farmerPassword,farmerStreet,farmerVillage,farmerPincode,farmerBio} =req.body;

    const farmerExists = await farmerModel.findOne({
        farmerEmail:farmerEmail
    })
    if(farmerExists){
        return res.json({
            message:'Farmer already exists'
        })
    }
    const hashedPass = await bcrypt.hash(farmerPassword,3);

    await farmerModel.create({
        farmerName,
        farmerEmail,
        farmerPassword:hashedPass,
        farmerPhone,
        farmerStreet,
        farmerVillage,
        farmerPincode,
        farmerBio
    })
    res.json({
        message:'registration completed succesfully'
    })
})

farmerRouter.post('/login',async(req,res)=>{
    const {farmerEmail,farmerPassword}=req.body

    const farmerExists = await farmerModel.findOne({
        farmerEmail
    })
    const hashedPass = bcrypt.compare(farmerPassword,farmerExists.farmerPassword)

    if(farmerExists&&hashedPass){
        const token = jwt.sign({id:farmerExists._id},
            FARMER_SECRET)
        res.json({
            message:'login succesfull',
            token
        })
    }else{
        res.json({
            message:"Invalid crediantials"
        })
    }
})





export{farmerRouter}