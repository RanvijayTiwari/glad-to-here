const mongoose=require("mongoose")

const isvalidate=(id)=>{
    const isvalid=mongoose.Types.ObjectId.isvalid(id);
    if(!isvalid) throw new Error("This id is not valid or not found");

};

module.exports={isvalidate}