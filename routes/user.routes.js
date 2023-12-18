const express=require("express");
const userModels = require("../models/user.models");
const userRouter=express.Router()
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const { generate } = require("../middlewares/jwtoken");
const { authmiddleware, isAdmin } = require("../middlewares/authmiddleware");
const { validate, isvalidate } = require("../validateMongodb");
const { generateRefresh } = require("../config/refreshtoken");



userRouter.post("/register",async(req,res)=>{
    const {email,password}=req.body;
    try {
        
        const user= await userModels.findOne({email});
            if(user){
               res.status(200).send({msg:"User already exists"})
            }else{
                const hash = bcrypt.hashSync(password, 8);
                const newUser=new userModels({...req.body,password:hash})
                res.json({msg:"successfull register",newUser})
            }
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})


userRouter.post("/login",async(req,res)=>{
        const {email,password}=req.body;
    try {
        const user=await userModels.findOne({email})
         const check=bcrypt.compareSync(password,user.password);

         if(check){
            const refreshtoken=await generateRefresh(user._id)
            const updateuser=await userModels.findByIdAndUpdate(user._id,{refreshToken:refreshtoken},{new:true});
            res.cookie("refreshToken",refreshToken,{httpOnly:true,maxAge:72*60*60*1000})
            res.status(200).json({msg:"Login Successful",token:generate(user._id)})
         }else{
            throw new Error("Invalid Credentials")
         }

        
    } catch (error) {
        res.status(400).json({msg:error})
        
    }
})


//logout functionality

userRouter.get("/logout",async(req,res)=>{
    const cookie=req.cookies;
    if(!cookie.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken=cookie.refreshToken;
    const user=await userModels.findOne(refreshToken)
    if(!user){
        res.clearCookie("refreshToken",{httpOnly:true,secure:true,});
        return res.sendStatus(204)
    }

    await userModels.findOneAndUpdate(refreshToken,{refreshToken:"",});
    res.clearCookie("refreshToken",{httpOnly:true,secure:true,});
    return res.sendStatus(204)
    try {
        
    } catch (error) {
        
    }
})

//handle refreesh token

userRouter.get("/refresh",async(req,res)=>{
    const cookie=req.cookies;
    try {

        if(!cookie) throw new Error("No refresh tokein in cookie")

        const refreshToken=cookie.refreshToken;

        const user=await userModels.findOne({refreshToken})

        if(!user){
            throw new Error("No refresh token in db or not matched")
        }

        jwt.verify(refreshToken,process.env.SECRETY,(err,decoded)=>{
            if(err){
                throw new Error("There is soemthing wrong")
            }

            const accesstoken=generate(user?._id)
            res.json({accesstoken})
        })
        
    } catch (error) {
        res.status(400).json({msg:error})
    }
})

userRouter.get("/getuser",async(req,res)=>{

    try {
        const getUser=await userModels.find();
        res.status(200).json({getUser})
    } catch (error) {
        res.status(400).json({msg:error})
    }
})


userRouter.get("/get/:id", authmiddleware,isAdmin ,async(req,res)=>{
    const {id}=req.params
    isvalidate(id)
    try {
        const user=await userModels.findById(id);
        res.status(200).json({user})
    } catch (error) {
        res.status(400).json({error:error.message,stack:error.stack}) 
    }
})

userRouter.put("/update/:id", authmiddleware,async(req,res)=>{
    const {_id}=req.user;
    isvalidate(_id)
    try {
        const user=await userModels.findByIdAndUpdate(_id,
        {firstname:req?.body?.firstname,
        lastname:req?.body?.lastname,
        email:req?.body?.email,
        mobile:req?.body?.mobile},
        {new:true});
        res.status(200).json({msg:user})

    } catch (error) {
        res.status(400).json({error:error.message,stack:error.stack}) 
    }
})

userRouter.delete("/delete/:id",async(req,res)=>{
    const {id}=req.params
    isvalidate(id)
    try {
        const user=await userModels.findByIdAndDelete(id);
        res.status(200).json({msg:"user deleted sucessfull"})
    } catch (error) {
        res.status(400).json({error:error.message,stack:error.stack}) 
    }
})


userRouter.put("/bloc-user/:id",authmiddleware,isAdmin,async(req,res)=>{
const {id}=req.params
isvalidate(id)
    try {
        const block= await userModels.findByIdAndUpdate(id,{isBlocked:true},{new:true})
        res.json({message:"User Blocked"})
    } catch (error) {
        res.status(400).json({msg:error})
    }
})

userRouter.put("/unbloc-user/:id",authmiddleware,isAdmin,async(req,res)=>{

    const {id}=req.params
    isvalidate(id)
    try {
        const unblock= await userModels.findByIdAndUpdate(id,{isBlocked:false},{new:true})
        res.json({message:"User unBlocked"})
    } catch (error) {
        res.status(400).json({msg:error})
    }
})
module.exports={userRouter}