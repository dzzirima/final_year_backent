/**This file contains all the methods related in communicating with the blockchain nodes
 * It can be consumed by any other files just by callin them eg testConnection()
 */

//importing json
import dotenv from 'dotenv'
dotenv.config()
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const medAcessABI = require("../contracts_abi/prescription.json");

import { ethers } from "ethers";
import { nanoid } from "nanoid";
import internal from "stream";

let provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_API_KEY_URL); //provider gives uss read only on the blockchain
let contractAddress = "0x4d7990563cbe1C56887Abb43D63322C73C052872";

let abi = medAcessABI.abi;

let prescriptionContract = new ethers.Contract(contractAddress, abi, provider);

// const signer = provider.getSigner();

const signer2 = new  ethers.Wallet(process.env.RINKEBY_PRIVATE_KEY,provider)

let prescriptionContractWithSigner = prescriptionContract.connect(signer2); // writting to blockchian needs a signer

export const testConnection = async () => {
  // Look up the current block number

  try {
    let balance = await provider.getBlockNumber();
    if (balance >= 0) {
      console.log("Blockchain is running ....");
      console.log("signer :", signer2);
      return true;
    }
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const getAccessors = async (req, res) => {
  try {
    let accessors = await prescriptionContract.getAccessors();
    res.status(200).json({
      success: true,
      accessors: accessors,
    });
  } catch (error) {
    res.status(501).json({
      success: false,
      message: error.message,
    });
    console.log(error.message);
  }
};

/**function to change the  state off blockchain needs a signer to be charged by the network
 *
 */
// function to create a new user
export const createUser = async (userId, req, res) => {
  const { firstname, lastname, role , email } = req.body;
  try {
    let newUser = await prescriptionContractWithSigner.createUser(
      userId,
      role,
      email,
      firstname,
      lastname,
     
    );

    console.log(newUser.hash);
  } catch (error) {
    console.log(error.message);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllUsersFromBlockChain = async (req, res) => {
  try {
    let allUsers = await prescriptionContract.getAllUsers();

    /**doing some mapping */
    let newUsers = allUsers.map((element) => {
      return {
        ...element,
        // userId:element[0],
        // verified:element[1],
        // firstname:element[2],
        // lastname:element[3]
      };
    });

    return res.status(200).json({
      success: true,
      data: newUsers,
    });
  } catch (error) {}
};

/**function to  create a prescription  */
export const createPrescription = async (req, res) => {


  let recordId = nanoid(10);
  let { patientId, doctorId, quantityPrescribed, drugDescription } = req.body;

  
  try {
    let newPrescription = await prescriptionContractWithSigner.createRecord(
      recordId,
      patientId,
      doctorId,
      quantityPrescribed,
      drugDescription
    );
    res.status(200).json({
      success: true,
      message: "The Prescription was created succefully",
      hash: newPrescription.hash,
    });
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: error.message,
    });
  }
};

/**function to get all user records */

export const getAllUserRecordsFromBlockchain = async (req, res) => {
  try {
    let { userId, requestor } = req.body;
    /**Do all the checking here  */
    let userRecords = await prescriptionContract.getUserRecords(
      userId,
      requestor
    );

    let cleanedRecords = userRecords.map((element) => {
      return {
        ...element,
      };
    });

    return res.status(200).json({
      success: true,
      data: cleanedRecords,
    });
  } catch (error) {
    return res.status(302).json({
      success: false,
      message: error.message,
    });
  }
};

/**................................................accesss related funtions...................................... */

export const grantAccessBlockchain = async (req, res) => {
  let { userId, accessor } = req.body;
  try {
    /**params , 1 userId , 2 ..accessoer */
    let newlyGrantedUser = await prescriptionContractWithSigner.addAccessors(
      userId,
      accessor
    );

    if (newlyGrantedUser.hash) {
      return res.status(200).json({
        success: true,
        hash: newlyGrantedUser.hash,
      });
    }
  } catch (error) {
    return res.status(302).json({
      success: false,
      message: error.message,
    });
  }
};

export const revokeAccessBlockchain = async (req, res) => {
  let { userId, accessorToBeRemoved } = req.body;
  try {
    /**params , 1 userId , 2 ..accessoer */
    let newlyRemoveUser = await prescriptionContractWithSigner.removeAccessor(
      userId,
      accessorToBeRemoved
    );

    if (newlyRemoveUser.hash) {
      return res.status(200).json({
        success: true,
        hash: newlyRemoveUser.hash,
      });
    }
  } catch (error) {
    return res.status(302).json({
      success: false,
      message: error.message,
    });
  }
};

export const getUserAccessorsFromBlockchain = async (req, res) => {
  let { userId } = req.body;

  try {
    let userAccessors = await prescriptionContract.getUserAccessors(userId);

    let cleanedIds = [];

    userAccessors.map((element) => {
      if (element.length != 0) {
        cleanedIds.push(element);
      }
    });

    return res.status(200).json({
      success: true,
      accessors: cleanedIds,
    });
  } catch (error) {
    return res.status(302).json({
      success: false,
      message: error.message,
    });
  }
};
