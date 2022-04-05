import {  grantAccessBlockchain, revokeAccessBlockchain} from "./blockchain.js"

export const  grantAcess = async (req,res) =>{

    let {userId,accessor} = req.body

    if(!userId || !accessor){
        return res.status(403).json({
            success:false,
            message:"Provide userId and accessor"
        })
    }

    try {
        await grantAccessBlockchain(req,res)
    } catch (error) {
        return res.status(301).json({
            success:false,
            message:error.message
          })
    }
}


export const revokeAccess  = async (req,res) =>{
    let {userId,accessorToBeRemoved} = req.body

    if(!userId || !accessorToBeRemoved){
        return res.status(403).json({
            success:false,
            message:"Provide userId and accessor"
        })
    }

    try {
        await revokeAccessBlockchain(req,res)
    } catch (error) {
        return res.status(301).json({
            success:false,
            message:error.message
          })
    }

}