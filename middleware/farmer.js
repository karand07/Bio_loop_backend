import jwt from 'jsonwebtoken';

const FARMER_SECRET = process.env.FARMER_SECRET;

export default function farmerAuth(req,res,next){
    const AuthHeader = req.headers.authorization
    const verify = jwt.verify(AuthHeader,FARMER_SECRET)
    
    if(verify){
        req.farmerId=verify.id
        next()
    }else{
        res.json({
            message:'something went rong'
        })
    }
}