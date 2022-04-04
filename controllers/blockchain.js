/**This file contains all the methods related in communicating with the blockchain nodes
 * It can be consumed by any other files just by callin them eg testConnection()
 */

//importing json
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const medAcessABI = require("../contracts_abi/prescription.json");

import { ethers } from "ethers";


let provider = new ethers.providers.JsonRpcProvider();
const signer = provider.getSigner(1)
let abi= medAcessABI.abi;


let prescriptionContract = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3",abi,provider)

export const testConnection = async () => {
  // Look up the current block number

  try {
    let balance = await provider.getBlockNumber();
    if (balance >= 0) {
      console.log("Blockchain is running ....");
      console.log("signer :",signer)
      return true;
    }
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const getAccessors = async (req,res) =>{
  try {
    let accessors = await  prescriptionContract.getAccessors()
    res.status(200).json({
      success:true,
      accessors:accessors,
    })
  } catch (error) {

    res.status(501).json({
      success:false,
      message:error.message
    })
    console.log(error.message)
  }
}


