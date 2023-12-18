// //not found

// const notFound=(req,res,next)=>{
//     const error=new Error(`Not FOund ${req.originalUrl}`);
//     res.status(400)
//     next(error)
// }


// //error Handler
// const errorHandler=(req,res,next)=>{
//     const statusCode=res.statusCode==200?500:res.statusCode;
//     res.status(statusCode)
//     res.json({msg:err?.message,
//     stack:err?.stack});
// }

// module.exports={notFound,errorHandler}