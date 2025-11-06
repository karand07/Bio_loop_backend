import mongoose, { Schema } from "mongoose";
const ObjectId = mongoose.Types.ObjectId


//Farmer Schema
const farmerSchema = new Schema({
    farmerName: {
      type: String,
      required: true,
      trim: true,
    },
    farmerEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    farmerPhone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    farmerPassword: {
      type: String,
      required: true,
      minlength: 6,
    },
    farmerStreet: {
      type: String,
      required: true,
      trim: true,
    },
    farmerVillage: {
      type: String,
      required: true,
      trim: true,
    },
    farmerPincode: {
      type: String,
      required: true,
      trim: true,
    },
    farmerBio: {
      type: String,
      trim: true,
      default: "",
    }
})
//company Schema 
const companySchema = new Schema({
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    companyEmail: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    companyPhone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    companyPassword: {
      type: String,
      required: true,
      minlength: 6,
    },
    companyStreet: {
      type: String,
      required: true,
      trim: true,
    },
    companyVillage: {
      type: String,
      required: true,
      trim: true,
    },
    companyPincode: {
      type: String,
      required: true,
      trim: true,
    },
    companyBio: {
      type: String,
      trim: true,
      default: "",
    }
})
const createWasteSchema = new Schema({
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer", // Reference to Farmer collection
      required: true,
    },
    companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company'
  },
    wasteType: {
      type: String,
      required: true,
      enum: ["Crop Waste", "Animal Waste", "Chemical Waste", "Domestic and Miscellaneous Farm Waste", "Other"],
      default: "Other",
    },
    wasteQuantity: {
      type: Number,
      required: true,
      min: 1,
    },
    wasteDescription: {
      type: String,
      trim: true,
    },
    wasteImage: {
      type: String, // URL or file path
      default: "",
    },
     isAllocated: {
    type: Boolean,
    default: false
  }
})

export const farmerModel = mongoose.model('farmer',farmerSchema)
export const companyModel= mongoose.model('company',companySchema)
export const createWasteModel = mongoose.model('createWaste',createWasteSchema)