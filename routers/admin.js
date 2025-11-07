import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Router } from 'express';
import { adminModel, createWasteModel, orderModel } from '../db.js';
import adminAuth from '../middleware/admin.js'; 

const ADMIN_SECRET = process.env.ADMIN_SECRET

const adminRouter = Router();

adminRouter.post('/signup',async(req,res)=>{
    const {adminName,adminEmail,adminPassword,adminAdhar} = req.body;
    
        const adminExists = await adminModel.findOne({
            adminEmail
        })
        if(adminExists){
            return res.json({
                message:'Farmer already exists'
            })
        }
    
        const hashedPass = await bcrypt.hash(adminPassword,10);
    
        await adminModel.create({
   adminName,
   adminEmail,
   adminPassword: hashedPass,
   adminAdhar
})

        res.json({
            message:'registration completed succesfully'
        })
})

adminRouter.post('/login',async(req,res)=>{
    const{adminEmail,adminPassword} = req.body;

    const adminExists = await adminModel.findOne({
        adminEmail
    })

    const hashedPass = bcrypt.compare(adminPassword,adminExists.adminPassword);

    if(adminExists&&hashedPass){
        const token = jwt.sign({id:adminExists._id},
            ADMIN_SECRET);
            res.json({
                message:'login successfull',
                token
            })
    }else{
        res.json({
            message:'invalid crediantials'
        })
    }
})

adminRouter.use(adminAuth);
//1.accepted waste 
adminRouter.get("/accepted-wastes", adminAuth, async (req, res) => {
  try {
    const wastes = await createWasteModel.find({ isAccepted: true })
      .populate("farmer")
      .populate("companyId");
    res.json(wastes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2️⃣ Admin creates an order for an accepted waste
adminRouter.post("/create-order/:wasteId", adminAuth, async (req, res) => {
  try {
    const { price } = req.body;
    const { wasteId } = req.params;
   const adminId = req.adminId; // ✅ matches adminAuth
 // assuming adminAuth sets req.admin

    const waste = await createWasteModel.findById(wasteId);
    if (!waste) return res.status(404).json({ message: "Waste not found" });

    const order = await orderModel.create({
      wasteId,
      farmerId: waste.farmer, 
      companyId: waste.companyId,
      adminId,
      price,
    });

    // mark as allocated
    waste.isAllocated = true;
    await waste.save();

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3️⃣ Update order price, status, or payment
adminRouter.put("/update-order/:orderId", adminAuth, async (req, res) => {
  try {
    const { price, orderStatus, paymentStatus } = req.body;
    const updatedOrder = await orderModel.findByIdAndUpdate(
      req.params.orderId,
      { price, orderStatus, paymentStatus, updatedAt: Date.now() },
      { new: true }
    );

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//get all orders
adminRouter.get("/all-orders", adminAuth, async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate("wasteId")
      .populate("farmerId")
      .populate("companyId")
      .populate("adminId");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { adminRouter };