import jwt from "jsonwebtoken"
export const get_signed_token = async (user) =>{
    const token = jwt.sign({email:user.email}, process.env.JWT)

    return token

    // return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    //     expiresIn: process.env.JWT_EXPIRE,
    //   });
}