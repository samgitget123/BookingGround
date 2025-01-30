import React, { useState } from "react";
import axios from "axios";
const baseUrl = `http://localhost:5000`;
//const baseUrl = `https://bookingapp-r0fo.onrender.com`;
const CreateGroundForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    photo: null,
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (!formData.description) newErrors.description = "Description is required.";
    if (!formData.photo) newErrors.photo = "Photo is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setIsLoading(true);
      const formDataToSubmit = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSubmit.append(key, formData[key]);
      });

      try {
        const response = await axios.post(
          `${baseUrl}/api/ground/createGround`, // Replace with your API endpoint
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log("Form submitted successfully", response.data);
        alert("Ground added successfully!");

        setFormData({
          name: "",
          location: "",
          photo: null,
          description: "",
        });
      } catch (error) {
        console.error("Error submitting the form:", error);
        alert("Failed to add ground. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Add Ground Details</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        {/* Name */}
        <div className="col-md-6">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>

        {/* Location */}
        <div className="col-md-6">
          <label htmlFor="location" className="form-label">
            Location
          </label>
          <input
            type="text"
            className={`form-control ${errors.location ? "is-invalid" : ""}`}
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
          />
          {errors.location && (
            <div className="invalid-feedback">{errors.location}</div>
          )}
        </div>

        {/* Photo */}
        <div className="col-md-6">
          <label htmlFor="photo" className="form-label">
            Photo
          </label>
          <input
            type="file"
            className={`form-control ${errors.photo ? "is-invalid" : ""}`}
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
          />
          {errors.photo && <div className="invalid-feedback">{errors.photo}</div>}
        </div>

        {/* Description */}
        <div className="col-md-12">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            id="description"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
          ></textarea>
          {errors.description && (
            <div className="invalid-feedback">{errors.description}</div>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-12 text-center">
          <button type="submit" className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroundForm;
