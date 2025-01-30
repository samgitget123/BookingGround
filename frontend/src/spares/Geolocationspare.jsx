import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { fetchPlaygrounds } from "../../../Features/citySlice";

const Getlocations = ({ onCityFetched, disabled }) => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");
  const [errorApi, setErrorApi] = useState(null);

  // Handle successful location fetch
  const handleSuccess = (position) => {
    const { latitude, longitude } = position.coords;
    setLocation({ latitude, longitude });

    // Call the reverse geocoding API
    getCityFromCoordinates(latitude, longitude);
  };

  const handleError = (error) => {
    if (error.code === error.PERMISSION_DENIED) {
      alert(
        "Location access denied. Please allow location access in your browser settings."
      );
    } else {
      setErrorApi(error.message);
    }
  };

  // Get city, state, district, and area from coordinates using OpenStreetMap API
  const getCityFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );

      const address = response.data.address;

      // Extract state, state_district, and area (suburb, neighbourhood, or area)
      const state = address.state || "Unknown State";
      const district = address.state_district || "Unknown District";
      const area = address.village || address.neighbourhood || "Unknown Area";

      console.log(state, district, area, "geolocations");

      // Set the state, district, and area
      setState(state);
      setDistrict(district);
      setArea(area);
      console.log(state, district , area , 'getlocations')
      // Call the onCityFetched function to pass data to the parent component
      onCityFetched({state, district, area});

      // Optionally dispatch fetchPlaygrounds if you need it
      dispatch(fetchPlaygrounds(area));
    } catch (error) {
      console.error("Error fetching city data:", error);
      setErrorApi("Unable to retrieve city data");
    }
  };

  const requestLocationAccess = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    requestLocationAccess(); // Request location access when component mounts
  }, []);

  return (
    <>
      <button
        className="btn btn-sm btn-primary my-3"
        onClick={requestLocationAccess}
        disabled={disabled}
      >
        Use Current Location
      </button>

      {errorApi && <p className="text-danger">{errorApi}</p>}
    </>
  );
};

export default Getlocations;
