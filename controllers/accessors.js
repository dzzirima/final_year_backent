import {  grantAccessBlockchain} from "./blockchain.js"

export const  grantAcess = async (req,res) =>{

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
    try {
        return res.status(200).json({
            success:true
        })
    } catch (error) {
        return res.status(301).json({
            success:false,
            message:error.message
          })
    }

}