import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { createWasteModel, farmerModel } from '../db.js';
import farmerAuth from '../middleware/farmer.js';
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
farmerRouter.use(farmerAuth);
farmerRouter.post('/creteWaste',async (req,res)=>{
    const farmerId = req.farmerId;
    const {wasteType,wasteQuantity,wasteDescription,wasteImage} = req.body;

   const waste = await createWasteModel.create({
        wasteType,
        wasteQuantity,
        wasteDescription,
        wasteImage,
        farmer:farmerId
    })
    res.json({
        message:"waste created successfully",
        WasteId: waste._id
    })
})

farmerRouter.get('/wasteList',async (req,res)=>{
    const farmerId = req.farmerId;
    
    const wasteList = await createWasteModel.find({
        farmer: farmerId
    })
    res.json({
        wasteList
    })
})


// 🧑‍🌾 1️⃣ Get all orders for a specific farmer
farmerRouter.get("/orders", farmerAuth, async (req, res) => {
  try {
    const farmerId = req.farmer.id; // farmerAuth middleware sets this
    const orders = await orderModel.find({ farmerId })
      .populate("wasteId")
      .populate("companyId")
      .populate("adminId");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export{farmerRouter}