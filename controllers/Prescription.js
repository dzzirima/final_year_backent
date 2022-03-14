import Prescription from "../models/Prescription.js";
import User from "../models/User.js";
import { nanoid } from "nanoid";
import { get_signed_token } from "../util/getsingedtoken.js";
import { sendEmail } from "../util/sendEmail.js";
import { ROLES } from "../util/Roles.js";

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
  /**
   *1.the prescriber who currently has access  to the record can update the record
   */

  let canUpDate = false;

  const {
    recordId,
    patientId,
    phamasistId,
    doctorId,
    quantityPrescribed,
    drugDescription,
    drugImageURL,
  } = req.body;

  try {
    let foundRecord = await Prescription.findOne({ recordId });
    /**check if the prescriber currently has access to record */
    canUpDate =
      foundRecord.accessors.indexOf(req.user._id.toString()) >= 0
        ? true
        : false;

    if (canUpDate) {
      await Prescription.findOneAndUpdate(
        {recordId },
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
    }


    return res.status(301).json({
      success:false,
      message:'Make sure u have access rights to that record'
    })
    
  } catch (error) {
    return res.json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteRecord = async (req, res) => {
  let { _id } = req.body;
  let canDelete = false;

  if (!_id) {
    return res.status(404).json({
      success: false,
      message: "Please specify the recordId ie _id",
    });
  }
  /**check if the user is the owner of the record */

  try {
    let foundRecord = await Prescription.findById(_id);
    canDelete =
      foundRecord.patientId === req.user._id.toString() ? true : false;

    if (canDelete) {
      await Prescription.findByIdAndDelete({ _id });
      return res.json({
        success: true,
        message: "Record was deleted successfully",
      });
    }

    return res.status(402).json({
      success: false,
      message: "Make sure you have you are the onwner of the document",
    });
  } catch (error) {
    let wrongIdFormat = `${error.message}`.startsWith("Cast to ObjectId")
      ? true
      : false;

    return res.json({
      success: false,
      message: "failed to delete Record",
      error: wrongIdFormat ? "Provide correct record _id" : `${error.message}`,
    });
  }
};

export const getRecord = async (req, res) => {
  /**
   * 1.Owner of the record should be able to retrive their records
   * 2.A prescriber with access rights should get the records
   */
  let owner = false;
  let hasAccessRights = false;

  const { recordId } = req.body;
  if (!recordId) {
    return res.status(404).json({
      success: false,
      message: "Please specify the recordId and prescriberId",
    });
  }
  try {
    let foundRecord = await Prescription.findOne({ recordId: recordId });

    if (!foundRecord)
      res.status(404).json({
        success: false,
        message: "No record found !!!! ",
      });

    /**check if the requestor is the patient */
    owner = foundRecord.patientId === req.user._id.toString() ? true : false;

    /**check it the prescriber has rights */
    hasAccessRights =
      foundRecord.accessors.indexOf(req.user._id.toString()) >= 0
        ? true
        : false;

    /**return the record if any of the 2  above conditions are satisfied */

    if (owner || hasAccessRights) {
      return res.status(200).json({
        success: true,
        data: {
          record: foundRecord,
        },
        message: "Prescriber added to view list",
      });
    }

    return res.status(405).json({
      success: false,
      message: "Make sure you  have access to the file you want to access",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: `${error.message}`,
    });
  }
};

export const getAllUserRecords = async (req, res) => {
  /**
   * 1.A user gets all his/her records
   * 2.Other requestors need to have access rights for them to access the records
   * N.B checking is done role based
   *
   */
  let isOwner = req.user.role === ROLES.PATIENT ? true : false;
  let foundRecords;

  try {
    if (isOwner) {
      foundRecords = await Prescription.find({
        patientId: req.user._id.toString(),
      });
    } else {
      foundRecords = await Prescription.find({
        accessors: req.user._id.toString(),
      });
    }
    return res.json({
      success: true,
      message: "user records found",
      data: {
        length: foundRecords.length,
        records: foundRecords,
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
      res.status(404).json({
        success: false,
        message: "No record  or presciber found...!! ",
      });

    /**if revoke is set to true , then remove the prescribers id from the list */

    if (revoke) {
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
