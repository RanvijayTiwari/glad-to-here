const express=require("express")
const productRouter=express.Router();
const ProductModels=require("../models/productModel")
const slugify=require("slugify"); 
const { authmiddleware, isAdmin } = require("../middlewares/authmiddleware");


//createproduct
productRouter.post("/",authmiddleware,isAdmin ,async(req,res)=>{
    
    try {
        if(req.body.title){
            req.body.slog=slugify(req.body.title)
        }
        const newProduct= new ProductModels(req.body);
        res.status(200).json(newProduct)
        
    } catch (error) {
       throw new Error(error) 
    }
})



//updateproduct
productRouter.put("/",authmiddleware,isAdmin ,async(req,res)=>{
    const id=req.params
    try {

        if(req.body.title){
            req.body.slog=slugify(req.body.title)
        }
        const updateProduct=await ProductModels.findByIdAndUpdate(id,req.body,{new:true})
        res.status(200).json(updateProduct)
        
    } catch (error) {
       throw new Error(error) 
    }
})


productRouter.delete("/",authmiddleware,isAdmin ,   async(req,res)=>{
    const id=req.params
    try {

        if(req.body.title){
            req.body.slog=slugify(req.body.title)
        }
        const updateProduct=await ProductModels.findOneAndDelete(id)
        res.status(200).json(updateProduct)
        
    } catch (error) {
       throw new Error(error) 
    }
})



//get product by id getaproduct
productRouter.get("/:id",async(req,res)=>{
     const {id}=req.params
    try {
      const findProduct=await ProductModels.findById(id) 
      res.status(200).send(findProduct); 
    } catch (error) {
       throw new Error(error) 
    }
})

//get all product  getallproduct
//by passing we also get so its for both getting all and if pass req.query
productRouter.get("/",async(req,res)=>{
    try {
       // const getall=await productRouter.find()
        const  queryobj={...req.query};
        const execute=["page","sort","limit","fields"]
        execute.forEach((ele) =>delete queryobj[ele] );
        
        let querystr=JSON.stringify(queryobj);
        querystr=querystr.replace(/\b(gte|gt|lte|lt)\b/g,(match)=>`$${match}`)

        let query=ProductModels.find(JSON.parse(querystr));



        //sorting
        if(req.query.sort){
            const sortBy=req.query.sort.
            query=query.sort(sortBy)
        }else{
            query=query.sort(".createdAt")

        }

        //limiting field

        if(req.query.fields){
            const fields=req.query.fields.split(",").join(" ");
            query=query.select(fields)
        }else{
            query=query.select("_v")
        }


        //pagination

        const page=req.query.page;
        const limit=req.query.limit;
        const skip=(page-1)*limit;
        query=query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount=await ProductModels.countDocuments();

            if(skip>=productCount)throw new Error("This page not exist")
        }
        const product=await qu;
        res.status(200).json(product)
        //find(req.query)
        //find({brand:req.query.brand,category:req.query.category})
        // .where("category").equals(req.query.category)
        //const obj={...req.obj}
        
        res.status(200).send(getall); 
    } catch (error) {
       throw new Error(error) 
    }
})


//filterproduct

// productRouter.get("/",async(req,res)=>{
//     const {minprice,maxprice,color,category,availablity,brand}=req.params;
//     try {
//         //console.log(req.query)

//         const filterProduct=await ProductModels.find({price:{$gte:minprice,$lte:maxprice},category,brand,color});
//         res.status(200).json(filterProduct)

//     } catch (error) {
//        throw new Error(error) 
//     }
// })

module.exports={productRouter }