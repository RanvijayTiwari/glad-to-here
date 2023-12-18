const jwt=require("jsonwebtoken");
const userModels = require("../models/user.models");

const authmiddleware=async(req,res,next)=>{
     const token=req.headers.authorization.split(" ")[1]

    try {
        if(token){
            const decoded=jwt.verify(token,process.env.SECRET);
            console.log(decoded);
            const user=await userModels.findById(decoded?.id);
            req.user=user;
            next();
        }else{
            throw new Error("There is no token")
        }
        
    } catch (error) {
        throw new Error("Not Authorized token expired ")
        
    }
}


const isAdmin=async(req,res,next)=>{
  const {email}=req.user;
  const admniUser=await userModels.findOne({email});
  if(admniUser.role!=="admin"){
    throw new Error("You are not an admin");
  }else{
    next()
  }
}




module.exports={authmiddleware,isAdmin }