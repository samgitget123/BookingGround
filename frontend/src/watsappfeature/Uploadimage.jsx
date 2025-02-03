import axios from 'axios';

export const uploadImageToServer = async (file) => {
  try {
    const formData = new FormData();
    formData.append('image', file);  // Append the file correctly

    const response = await axios.post('http://localhost:5000/uploads', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data'  // Ensure correct content type
      }
    });

    console.log(response.data.imageUrl, 'Uploaded image URL');
    return response.data.imageUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};
