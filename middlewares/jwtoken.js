const jwt=require("jsonwebtoken");

const generate=(id)=>{
    return jwt.sign({id},process.env.SECRET,{expireIn:"1d"})
}

module.exports={generate};