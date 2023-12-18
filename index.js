const express=require("express")
const app=express()
const dotenv=require("dotenv");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/user.routes");
//const { notFound, errorHandler } = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const { productRouter } = require("./routes/product.routes");
const morgan=require("morgan ")
const port=process.env.PORT||4000;


app.use(morgan("dev"))//give all about what are the request we make or post or add
app.use(express.json())
app.use(cookieParser())
app.use("/user",userRouter)
app.use("/product",productRouter)
// app.use(notFound)
// app.use(errorHandler)
app.listen(port,async()=>{
    try {

        await connection
        console.log("server runnign at port 5000")
        console.log("connected to server");
    } catch (error) {
        console.log(error,"error")
    }
})