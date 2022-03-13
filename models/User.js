import mongoose from 'mongoose'


const UserSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:[true,"Please provide the username"]
    },
    lastName:{
        type:String,
        required:[true,"Please provide the username"]
    },
    email:{
        type:String,
        required:[true, "Please provide an email"],
        unique:true
    },
    phone:String,
    password:{
        type:String,
        required:[true,"Please add  a password"],
        minlength:6,
        // when we query  for the user do we want to return the password 
        select:false
    },
    address:String,
    role:String,

    identityProofUrl:String,

    joinDate:{
        type :Date,
        default: new Date()

    },

    nextOfKin:{},

    passwordResetToken:{
        type:String,
        expireAfterSeconds:20
    },


    profileImageURL:String
});

const User = mongoose.model("User",UserSchema)

export default User