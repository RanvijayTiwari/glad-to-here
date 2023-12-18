const jwt=require("jsonwebtoken");

const generateRefresh=(id)=>{
    return jwt.sign({id},process.env.SECRET,{expireIn:"3d"})
}

module.exports={generateRefresh};