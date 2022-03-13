

import Prescription from "../models/Prescription.js";
import User from "../models/User.js";
import { nanoid } from 'nanoid'
import { get_signed_token } from "../util/getsingedtoken.js";
import { sendEmail } from "../util/sendEmail.js";

export const createRecord = async (req, res) => {

  const { 
      patientId,
      phamasistId,
      doctorId,
      quantityPrescribed,
      drugDescription,
      drugImageURL,
       } = req.body

       console.log(patientId)


       try {
       let  foundUser = await User.findOne({
           _id: patientId
        })

        
        if(!foundUser){
            return res.json({
                success:false,
                message:"No user found"
            })
        }
    } catch (error) {
        return res.json({
            success:false,
            message:`${error.message}`
        }) 
    }


  try {
    const record = await Prescription.create({
        recordId:nanoid(10),
        patientId,
        phamasistId,
        doctorId,
        quantityPrescribed,
        drugDescription,
        drugImageURL,
     
    });
    res.json({
        "success":"true",
        message:"Record  was created successfully !!!",

    }).status(200)
  } catch (error) {
      console.log(error)
      res.json({
          success:"false",
          "message":error.message
      }).status(201);
      return

  }

};



export const updateRecord = async (req,res) =>{

    const { _id ,
        patientId,
        phamasistId,
        doctorId,
        quantityPrescribed,
        drugDescription,
        drugImageURL,
       } = req.body

        try {
            await Prescription.findByIdAndUpdate(
                {_id},
                {$set:{
                    patientId,
                    phamasistId,
                    doctorId,
                    quantityPrescribed,
                    drugDescription,
                    drugImageURL,
                }
                }
            )
             return res.json({
                success:true,
                message:"Record was  Updated SuccessFully !!!"
            })
        } catch (error) {
            return res.json({
                success:false,
                message:error.message
            })
            
        }

}

export const deleteRecord = async (req,res) =>{

    let {_id} = req.query
    

    try {
        await Prescription.findByIdAndDelete(
            {_id},
        )
        return  res.json({
            success:true,
            message:"Record was deleted successfully"
        })
        
    } catch (error) {
        return res.json({
            success:false,
            message:"failed to delete Record",
            error:error.message
        })
    }

}

export const getRecord = async (req,res) =>{
    
    let foundRecord
    
    try {
        foundRecord = await Prescription.findOne({
            recordId:req.body.recordId
        })

        if(!foundRecord){
            return res.json({
                success:false,
                message:"No record found"
            })
        }

        return res.json({
            success:true,
            message:'user record',
            data:{
                record:foundRecord
            }
        })
    } catch (error) {
        return res.json({
            success:false,
            message:`${error.message}`
        }) 
    }
}

export const getAllUserRecords = async (req,res) =>{
    
    try {
        let foundRecords = await Prescription.find({
            
        })
        return res.json({
            success:true,
            message:'user records found',
            data:{
                users:foundRecords
            }
        })
    } catch (error) {
        return res.json({
            success:false,
            message:`${error.message}`
        }) 
    }
}

// forget the password




