import React, { useState, useEffect } from "react";
import axios from "axios";
import { useBaseUrl } from "../../Contexts/BaseUrlContext";
import { indianCities } from "../Data/CityData";
import Swal from "sweetalert2";
const CreateGroundForm = () => {
  const { baseUrl } = useBaseUrl();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    country: "",
    state: "",
    city: "",
    stateDistrict: "",
    photo: null,
    description: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [locationLoaded, setLocationLoaded] = useState(false);

  // Function to get the user's geolocation and fetch the details
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Using OpenStreetMap API (or any other API you prefer) for reverse geocoding
            const res = await axios.get(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
            );

            const address = res.data.address;
            console.log(address, 'useraddress');
            // Setting the location details in form state
            setFormData({
              ...formData,
              state: address.state || "",
              stateDistrict: address.state_district || "",
              location: address.village || "",
              country: address.country || "",
              city: address.city || "",
            });
            setLocationLoaded(true);
          } catch (error) {
            Swal.fire("Error", "Unable to fetch location. Please check your network.", "error");
          }
        },
        (error) => {
          Swal.fire("Error", "Unable to retrieve your location.", "error");
        }
      );
    } else {
      Swal.fire("Error", "Geolocation is not supported by your browser.", "error");
    }
  };

  useEffect(() => {
    // Get the user location on initial load
    getUserLocation();
  }, []);

  const validate = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.location) newErrors.location = "Location is required.";
    if (!formData.country) newErrors.country = "Country is required.";
    if (!formData.state) newErrors.state = "State is required.";
    if (!formData.stateDistrict) newErrors.stateDistrict = "State District is required.";
    if (!formData.city) newErrors.city = "City is required."; // Validation for city
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
          `${baseUrl}/api/ground/createGround`,
          formDataToSubmit,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        Swal.fire("Success", "Ground added successfully!", "success");

        // Reset form fields after successful submission
        setFormData({
          name: "",
          location: "",
          country: "",
          state: "",
          city: "",
          stateDistrict: "",
          photo: null,
          description: "",
        });
        setErrors({}); // Clear errors
      } catch (error) {
        Swal.fire("Error", "Failed to add ground. Please check your network connection.", "error");
      } finally {
        setIsLoading(false); // Always reset loading state
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
            Ground Name
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
        <div className="col-md-6">
          <label htmlFor="city" className="form-label">
            City
          </label>
          <select
            className={`form-control ${errors.city ? "is-invalid" : ""}`}
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          >
            <option value="">Select a city</option>
            {indianCities.map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
          </select>

          {errors.city && <div className="invalid-feedback">{errors.city}</div>}
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

        {/* Country */}
        <div className="col-md-6">
          <label htmlFor="country" className="form-label">
            Country
          </label>
          <input
            type="text"
            className={`form-control ${errors.country ? "is-invalid" : ""}`}
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          />
          {errors.country && <div className="invalid-feedback">{errors.country}</div>}
        </div>

        {/* State */}
        <div className="col-md-6">
          <label htmlFor="state" className="form-label">
            State
          </label>
          <input
            type="text"
            className={`form-control ${errors.state ? "is-invalid" : ""}`}
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
          />
          {errors.state && <div className="invalid-feedback">{errors.state}</div>}
        </div>



        {/* State District */}
        <div className="col-md-6">
          <label htmlFor="stateDistrict" className="form-label">
            State District
          </label>
          <input
            type="text"
            className={`form-control ${errors.stateDistrict ? "is-invalid" : ""}`}
            id="stateDistrict"
            name="stateDistrict"
            value={formData.stateDistrict}
            onChange={handleInputChange}
          />
          {errors.stateDistrict && (
            <div className="invalid-feedback">{errors.stateDistrict}</div>
          )}
        </div>

        {/* Submit Button */}
        <div className="col-12 text-center my-3">
          <button type="submit" className="btn btn-lg btn-primary w-100" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateGroundForm;
