const User = require('../models/userModel'); 
const uploadImageToCloudinary = require("../utils/imageUploader");

// upload image in user model
const uploadFile = async(req,res)=>{
    try{
        const thumbnail = req.files.thumbnailImage;
        const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
        return res.status(200).json({url:thumbnailImage.secure_url,})

    }catch(error){
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

//update user data
const updateUser = async (req, res) => {
  try {
    const { fullname , gender , profilePic , address } = req.body;
    const userId = req.userId;
    
    const updatedUser = await User.findOneAndUpdate(
        {_id:userId},
        {
            fullname,
            gender,
            profilePic,
            address,
        },
        {
            new : true,
        }
    );

    res.json(updatedUser); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to get user data
const getUser = async (req, res) => {
  try {
    const userId = req.userId;
    console.log(userId);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Controller function to delete user data
const deleteUser = async (req, res) => {
  try {
    const userId = req.userId;

    // Delete the user from the database by userId
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {uploadFile, updateUser, getUser, deleteUser };
