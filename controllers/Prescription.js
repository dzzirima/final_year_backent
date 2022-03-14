import Prescription from "../models/Prescription.js";
import User from "../models/User.js";
import { nanoid } from "nanoid";
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
  } = req.body;

  console.log(patientId);

  try {
    let foundUser = await User.findOne({
      _id: patientId,
    });

    if (!foundUser) {
      return res.json({
        success: false,
        message: "No user found",
      });
    }
  } catch (error) {
    return res.json({
      success: false,
      message: `${error.message}`,
    });
  }

  try {
    const record = await Prescription.create({
      recordId: nanoid(10),
      patientId,
      phamasistId,
      doctorId,
      quantityPrescribed,
      drugDescription,
      drugImageURL,
    });
    res
      .json({
        success: "true",
        message: "Record  was created successfully !!!",
      })
      .status(200);
  } catch (error) {
    console.log(error);
    res
      .json({
        success: "false",
        message: error.message,
      })
      .status(201);
    return;
  }
};

export const updateRecord = async (req, res) => {
  const {
    _id,
    patientId,
    phamasistId,
    doctorId,
    quantityPrescribed,
    drugDescription,
    drugImageURL,
  } = req.body;

  try {
    await Prescription.findByIdAndUpdate(
      { _id },
      {
        $set: {
          patientId,
          phamasistId,
          doctorId,
          quantityPrescribed,
          drugDescription,
          drugImageURL,
        },
      }
    );
    return res.json({
      success: true,
      message: "Record was  Updated SuccessFully !!!",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRecord = async (req, res) => {
  let { _id } = req.query;

  try {
    await Prescription.findByIdAndDelete({ _id });
    return res.json({
      success: true,
      message: "Record was deleted successfully",
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "failed to delete Record",
      error: error.message,
    });
  }
};

export const getRecord = async (req, res) => {
  let foundRecord;

  try {
    foundRecord = await Prescription.findOne({
      recordId: req.body.recordId,
    });

    if (!foundRecord) {
      return res.json({
        success: false,
        message: "No record found",
      });
    }

    return res.json({
      success: true,
      message: "user record",
      data: {
        record: foundRecord,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `${error.message}`,
    });
  }
};

export const getAllUserRecords = async (req, res) => {
  try {
    let foundRecords = await Prescription.find({});
    return res.json({
      success: true,
      message: "user records found",
      data: {
        users: foundRecords,
      },
    });
  } catch (error) {
    return res.json({
      success: false,
      message: `${error.message}`,
    });
  }
};

export const permisions = async (req, res) => {
  const { recordId, prescriberId, revoke } = req.body;

  let foundPrescriber;

  if (!recordId || !prescriberId) {
    return res.status(404).json({
      success: false,
      message: "Please specify the recordId and prescriberId",
    });
  }

  try {
    let foundRecord = await Prescription.findOne({ recordId: recordId });

    /**check if there is prescriber with that id */
    try {
      foundPrescriber = await User.findById(prescriberId);
    } catch (error) {
      let message = `${error.message}`;

      message = message.startsWith("Cast to ObjectId")
        ? "Please enter valid user Id"
        : message;

      return res.status(500).json({
        success: false,
        message: message,
      });
    }
    if (!foundRecord || !foundPrescriber)
      res
        .status(404)
        .json({
          success: false,
          message: "No record  or presciber found...!! ",
        });

    /**if revoke is set to true , then remove the prescribers id from the list */

    if(revoke){
        let updatedRecord = await Prescription.updateOne(
            { recordId: recordId },
            { $pull: { accessors: prescriberId } }
          );

          return res.status(200).json({
            success: true,
            message: "Prescriber was successfully removed from view list",
          });
        
    }

    /**Add the doctors or phamacist id into an array */
    let updatedRecord = await Prescription.updateOne(
      { recordId: recordId },
      { $addToSet: { accessors: prescriberId } }
    );

    return res.status(200).json({
      success: true,
      message: "Prescriber added to view list",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `${error.message}`,
    });
  }
};
