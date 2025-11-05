import jwt from 'jsonwebtoken';

const COMPANY_SECRET = process.env.COMPANY_SECRET;

export default function companyAuth(req,res,next){
    const AuthHeader = req.headers.authorization

    const verify = jwt.verify(AuthHeader,COMPANY_SECRET);

    if(verify){
        req.companyId = verify.id;
        next()
    }else{
        res.json({
            message:'Something Went rong'
        })
    }
}