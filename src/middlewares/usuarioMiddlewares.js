const validateBody=(req,res,next)=>{
    const {body}=req


    if(body.nome===undefined){
        res.status(400).json({message:'não permitmos dados undefine 400'})
    }

    if(body.nome===''){
        res.status(400).json({message:'não permitmos dados vasio 400'})
    }

    next()
}



module.exports={
    validateBody
}