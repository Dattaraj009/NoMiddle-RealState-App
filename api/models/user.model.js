import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    avatar: {
      type: String,
      default:
        'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
    },
    panNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    panCardUrl: {
      type: String,
    },
    panVerified: {
      type: Boolean,
      default: false,
    },
    panDocumentUrl: {
      type: String
    },
    // Aadhaar Card details
    aadharNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    aadharDocUrl: {
      type: String,
    },
    isAadharVerified: {
      type: Boolean,
      default: false,
    },
    favorites: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Listing',
      default: [],
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
