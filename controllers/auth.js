
import User from "../models/User.js";
import { get_signed_token } from "../util/getsingedtoken.js";
import { sendEmail } from "../util/sendEmail.js";

export const register = async (req, res) => {
  const { 
      firstname,
       lastname, 
       email, 
       password,
       phone,
       address,
       role,
       profileImageURL,
       nextOfKin } = req.body


  // double checking when creating a user
  let user = await User.findOne({email:email})
  if(user !== null){
      return res.json({
        "success":false,
        message:"User with that email already exist",
        data:{
        }
      })

  }
  try {
    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      phone,
      address,
      role,
      nextOfKin,
      profileImageURL
    });
    res.json({
        "success":true,
        message:"User created successfully",
        data:{
            "token": await get_signed_token(user)
        }
        

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

export const login = async (req,res) =>{

    
    const {email, password} = req.body
   
    if(!email && !password){
        res.json({
            "success":"false",
            "message":"please provide email and password"
        }).status(404)
        return;
    }
    try {
        //1 check if the useremail  is in the database
        const user =  await User.findOne({email}).select("+password");

       

        // check if the user exist
        if(!user){
            res.json({
                "success":"false",
                "message":"User with that details not found"
            }).status(401)
            return;
        }
        // check if the passsword match
        if(user.password != password){
            res.json({
                "success":"false",
                "message":"Provide correct password"
            }).status(401)
            return;


        }
       
        res.json({
            "success":"true",
            message:"successfuly loged in",
            data:{
                "token":await get_signed_token(user),
                user:user
            }
            
        })

        
    } catch (error) {
        console.log(error)
        res.json({
            "success":"false",
            "message":error.message

        });
        return;
        
    }
}

export const updateUser = async (req,res) =>{

    const { _id ,
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        role,
        profileImageURL,
        nextOfKin} = req.body

        try {
            await User.findByIdAndUpdate(
                {_id},
                {$set:{firstName,
                    lastName,
                    email,
                    password,
                    phone,
                    address,
                    role,
                    nextOfKin,
                    profileImageURL
                }
                }
            )
             return res.json({
                success:true,
                message:"User Updated SuccessFully"
            })
        } catch (error) {
            return res.json({
                success:false,
                message:error.message
            })
            
        }

}

export const deleteUser = async (req,res) =>{

    let {_id} = req.query
    

    try {
        await User.findByIdAndDelete(
            {_id},
        )
        return  res.json({
            success:true,
            message:"User deleted successfully"
        })
        
    } catch (error) {
        return res.json({
            success:false,
            message:"failed to delete",
            error:error.message
        })
    }

}

export const getUser = async (req,res) =>{

    let foundUser
    
    try {
        foundUser = await User.findOne({
            _id:req.query
        })

        if(!foundUser){
            return res.json({
                success:false,
                message:"No user found"
            })
        }

        return res.json({
            success:true,
            message:'user found',
            data:{
                user:foundUser
            }
        })
    } catch (error) {
        return res.json({
            success:false,
            message:`${error.message}`
        }) 
    }
}

export const getAllUsers = async (req,res) =>{
    
    try {
        let foundUsers = await User.find({
            
        })
        return res.json({
            success:true,
            message:'user found',
            data:{
                users:foundUsers
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
export const forgetPassword = async (req,res) =>{
    const {email} = req.body
    try {
        
        let foundUser = await User.findOne({
            email:email
        })

        
        if(!foundUser){
            return res.json({
                success:false,
                message:"No user with that email address found"
            })
        }

        foundUser.passwordResetToken = "reset Token"
        await foundUser.save()

        sendEmail("dzzlearning23@gmail.com","test123456")

        return res.json({
            success:true,
            message:'We have send reset token to your email address',
            data:{

            }
        })
        
    } catch (error) {
        return console.log(error)
    }
}

export const resetPassword = async (req,res) =>{
    try {

        const {passwordResetToken,newPassword} = req.body;

        let foundUser = await User.findOne({
            passwordResetToken:passwordResetToken
        })

        if(!foundUser){
            return res.json({
                success:false,
                message:"provide valid password Reset Token"
            })
        }

        foundUser.password = newPassword
        await foundUser.save()

        return res.json({
            success:true,
            message:'Password reset success',
            data:{

            }
        })
    } catch (error) {
        return console.log(error)
        
    }
}



