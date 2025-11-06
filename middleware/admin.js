import jwt from 'jsonwebtoken';

const ADMIN_SECRET = process.env.ADMIN_SECRET;

export default function adminAuth(req,res,next){
    const AuthHeader = req.headers.authorization

    const verify = jwt.verify(AuthHeader,ADMIN_SECRET);

    if(verify){
        req.adminId = verify.id;
        next()
    }else{
        res.json({
            message:'Something Went rong'
        })
    }
}