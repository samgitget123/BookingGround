import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCity,
  selectArea,
  fetchPlaygrounds,
} from "../../Features/citySlice";
import brandlogo from "../../Images/brandlogonobg.png";
import Carousels from "./promotions/Carousels";
import Getlocations from "./locations/Getlocations";
import TypingText from "./animations/Typingtext";
import { telanganaCities } from "../Data/CityData";
import { FaMapMarkerAlt } from "react-icons/fa";
const Herosection = () => {
  const dispatch = useDispatch();
  const { cities, selectedCity, selectedArea, loading, error } = useSelector(
    (state) => state.city
  );

  const [city, setCity] = useState(selectedCity || "");  //state
  const [area, setArea] = useState(selectedArea || "");
  const [place, setPlace] = useState("");
  const [isGetLocationDisabled, setIsGetLocationDisabled] = useState(false);
  console.log(place, city ,  'stateLocation');
  //dispatch(fetchPlaygrounds({State: city , City: place}));
  // Handle city and area fetched from Getlocations component
  const handleCityFetched = ({ state, district, area }) => {
    console.log(state, district, area, "locations");

    // Update local state
    setCity(state);
    setArea(area);
    dispatch(fetchPlaygrounds({ State: state, City: district }));
    // Update Redux store
    //dispatch(selectCity(state)); // Set city in Redux store
   // dispatch(selectArea(area)); // Set area in Redux store

    // Fetch playgrounds for the selected city
    console.log(state, place, 'both');
    // dispatch(fetchPlaygrounds({State: state , City: place}));

    // Disable the Get Location button
    setIsGetLocationDisabled(true);
  };

  // const handleStateChange = (event) => {
  //   const selectedState = event.target.value;
  //   console.log(selectedState, 'selectedState')
  //   // Update local and global state
  //   setCity(selectedState);
  //   console.log(selectedState, 'userstate');
  //   dispatch(selectCity(selectedState));

  //   // Clear the area when the city changes
  //   setArea("");
  //   dispatch(selectArea(""));

  //   // Fetch playgrounds for the selected city
  //   if (selectedState) {
  //     dispatch(fetchPlaygrounds(selectedState));
  //     setIsGetLocationDisabled(true); // Disable Get Location button
  //   }
  // };
  const handlecityChange = (event) => {
    const selectedCity = event.target.value;
    console.log(selectCity, city ,  'selectedCity');
    setPlace(selectedCity); 
    if (selectedCity) {
      dispatch(fetchPlaygrounds({ State: city, City: selectedCity }));
    }
   // dispatch(selectCity(selectedCity));
    console.log(selectedCity, 'selectedCity');
   // This will set the 'place' state to the selected city
  }
  console.log(place, 'place');
  const handleAreaChange = (event) => {
    const selectedArea = event.target.value;

    // Update local and global state
    setArea(selectedArea);
   // dispatch(selectArea(selectedArea));
  };

  // Re-enable the Get Location button if the city is cleared
  useEffect(() => {
    if (!selectedCity) {
      setIsGetLocationDisabled(false);
    }
  }, [selectedCity]);

  return (
    <>
      <section className="text-dark primaryColor">
        <div className="container-fluid">
          <div className="row">
            {/* Carousel Section */}
            <div className="col-lg-8 d-none d-md-block">
              <Carousels />
            </div>

            {/* Form Section */}
            <div
              className="col-lg-4 secondaryColor"
              style={{ borderRadius: "0px 0px 40px 40px" }}
            >
              <div className="d-flex align-items-center justify-content-center text-center">
                <div className="mt-2 mt-md-5">
                  <div className="mb-3 d-none d-sm-block mb-sm-5">
                    <img
                      className="img-fluid rotateImage"
                      src={brandlogo}
                      alt="logo"
                    />
                  </div>
                  <TypingText />
                  {/* user state location */}
                  <form role="search" onSubmit={(e) => e.preventDefault()}>
                    {/* City Dropdown */}
                         <div className="d-flex justify-content-center">
                                         <select
                                          className="form-control my-3 w-70"
                                          value={city} // Set value to 'place' state
                                          //onChange={handlecityChange} // Update 'place' when the user selects a city
                                          style={{borderRadius:"20px",fontWeight:"bold"}}
                                        >
                                          <option value="">{city}</option>
                                          {/* {indianStates.map((state, index) => (
                                            <option key={index} value={
                                              state
                                            }>
                                              {state}
                                            </option>
                                          ))} */}
                                        </select>
                                        <FaMapMarkerAlt style={{fontSize:"50px" , color:"#00EE64"}}/>
                                       </div>
                    {/* <input
                      type="text"
                      className="form-control my-3"
                      value={city}  // Set value to 'place' state
                      placeholder="User Location"
                      list="cities-list" // This provides suggestions as users type
                    /> */}


                    {/* Area Dropdown */}
                    <select
                      className="form-control my-3"
                      value={place} // Set value to 'place' state
                      onChange={handlecityChange} // Update 'place' when the user selects a city
                    >
                      <option value="">Select City</option>
                      {telanganaCities.map((city, index) => (
                        <option key={index} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </form>

                  {/* Get Location Button */}
                  <div>
                    <Getlocations
                      onCityFetched={handleCityFetched}
                      disabled={isGetLocationDisabled}
                    />
                  </div>

                  <div>
                    <h4 className="webheading">
                      Find Grounds{" "}
                      <span className="webheading2">@ Your Nearest</span>
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Herosection;