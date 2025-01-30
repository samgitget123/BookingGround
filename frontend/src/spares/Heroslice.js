
// Herosection.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCity, selectArea, fetchPlaygrounds } from '../../Features/citySlice';
import banner from '../../Images/turf.jpeg';

const Herosection = () => {
  const dispatch = useDispatch();
  const { cities, selectedCity, selectedArea, loading, error } = useSelector(state => state.city);
console.log('cities' , selectedCity)
  const handleCityChange = (event) => {
    const city = event.target.value;
    dispatch(selectCity(city));
    if (city) {
      dispatch(fetchPlaygrounds(city)); // Fetch data when city is selected
    }
  };

  const handleAreaChange = (event) => {
    dispatch(selectArea(event.target.value));
  };
  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`);
          const data = await response.json();
  
          console.log('API Response:', data); // Inspect the full API response for debugging
  
          // Extract city and area, handling cases where city might be missing
          const city = data.address.city || data.address.town || data.address.village || data.address.hamlet || data.address.state || 'Unknown City';
          const area = data.address.neighbourhood || data.address.suburb || data.address.road || data.address.footway || 'Unknown Area';
  
          console.log('Current location:', { latitude, longitude, city, area });
  
          // Set city and area in state
          dispatch(selectCity(city));
          dispatch(selectArea(area));
  
          // Optionally, trigger a fetch for playgrounds or related data based on the selected city
          if (city && city !== 'Unknown City') {
            dispatch(fetchPlaygrounds(city));
          }
  
        } catch (error) {
          console.error('Error with reverse geocoding:', error);
        }
      }, (error) => {
        console.error('Error getting location:', error);
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };
  
  return (
    <>
      <section className='heroSectioncss'>
        <div className="container-fluid">
          <div className="row d-flex justify-content-center bg-light">
            <div className="col-lg-4 col-md-12 col-sm-12 col-xs-12 g-0 p-2 bg-light">
              <div className='my-2'>
                <h4>Choose Your <span className='text-warning'>Ground</span></h4>
                <form className="d-flex my-2" role="search" onSubmit={(e) => e.preventDefault()}>
                  <select 
                    className="form-control me-2" 
                    value={selectedCity} 
                    onChange={handleCityChange}
                  >
                    <option value="">Select a city</option>
                    {cities.map((city, index) => (
                      <option key={index} value={city.city}>{city.city}</option>
                    ))}
                  </select>
                  <select 
                    className="form-control me-2" 
                    value={selectedArea} 
                    onChange={handleAreaChange}
                    disabled={!selectedCity} 
                  >
                    <option value="">Select an area</option>
                    {selectedCity && cities.find(city => city.city === selectedCity)?.addresses.map((addr, index) => (
                      <option key={index} value={addr.area}>{addr.area}</option>
                    ))}
                  </select>
                </form>
                <div className='my-3'>
                  <button className="btn btn-primary" onClick={handleGetCurrentLocation}>
                    Use Current Location
                  </button>
                </div>
                <div className='my-3'>
                  <h4 className='heading_caption'>Find Grounds <span className='text-warning'>@ Your Nearest</span></h4>
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-md-12 col-sm-12 g-0 bg-light">
              {/* Your carousel code */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Herosection;
