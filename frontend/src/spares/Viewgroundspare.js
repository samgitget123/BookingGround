import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroundDetails } from '../../Features/groundSlice';
import groundImage from '../../Images/turf.jpeg';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
//Modal
import BookModal from '../Modals/BookModal';
// Helper function to format slot times
const formatSlot = (slot) => {
  const [hours, minutes] = slot.split('.').map(Number);
  const startHours = Math.floor(hours);
  const startMinutes = minutes === 0 ? 0 : 30;
  const endHours = startMinutes === 0 ? startHours : startHours + 1;
  const endMinutes = startMinutes === 0 ? 30 : 0;

  return `${String(startHours).padStart(2, '0')}:${String(startMinutes).padStart(2, '0')} - ${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
};

// Helper function to reverse format slot
const reverseFormatSlot = (formattedSlot) => {
  const [startTime] = formattedSlot.split(' - ');
  const [hours, minutes] = startTime.split(':').map(Number);
  return minutes === 0 ? `${hours}.0` : `${hours}.5`;
};
// Helper function to format date to "YYYY-MM-DD"
const formatDate = (date) => {
  if (!(date instanceof Date)) {
    // Attempt to convert the date to a Date object
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ViewGround = () => {
  const { gid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const groundState = useSelector((state) => state.ground || {});
  const { ground, loading, error } = groundState;
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings , setBookings] = useState([]);
  console.log('selectedDate' , formatDate(selectedDate.toDateString()));
  // useEffect(() => {
  //   if (gid) {
  //     dispatch(fetchGroundDetails(gid)); // Use gid from params
  //     const fetchGroundDetailsWithDate = async () => {
  //       const formattedDate = formatDate(selectedDate);
  //       console.log('resdate' , formattedDate);
  //       try {
  //         const response = await axios.get(`http://localhost:5000/ground/${gid}?date=${formattedDate}`);
  //         // Handle the response
  //         console.log('Ground Details:', response.data.slots);
  //         setBookings(response.data.slots);
  //         console.log('Alreadybooks' , bookings);
  //       } catch (error) {
  //         console.error('Error fetching ground details:', error);
  //       }
  //     };

  //     fetchGroundDetailsWithDate();
  //   }
  // }, [dispatch, gid , selectedDate]);
 // Fetch ground details and booked slots
 useEffect(() => {
  if (gid) {
    dispatch(fetchGroundDetails(gid)); // Fetch initial ground details

    const fetchGroundDetailsWithDate = async () => {
      const formattedDate = formatDate(selectedDate);
      console.log('Formatted Date:', formattedDate);
      try {
        const response = await axios.get(`http://localhost:5000/ground/${gid}?date=${formattedDate}`);
        // Assuming response.data.slots is an array of booked slots
        setBookings(response.data.slots || []);

        console.log('Fetched Booked Slots:', response.data.slots);
      } catch (error) {
        console.error('Error fetching ground details:', error);
      }
    };

    fetchGroundDetailsWithDate();
  }
}, [dispatch, gid, selectedDate]); // Dependency array includes selectedDate to refetch data on date change

 const handleDateChange = (date) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Example function to format slot
  const formatSlot = (slot) => {
    // Implement your formatSlot function here
    return slot; // Example: return formatted slot
  };

  const confirnnowClick = () => {
    setShowModal(true);
  }
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
  };
  const handleBookClick = async () => {
    console.log('selectedSlots', selectedSlots);
    const slotsForAPI = selectedSlots.map(reverseFormatSlot);
    if (selectedSlots.length > 0) {
      const bookingData = {
        ground_id: gid,            // Ground ID from route params
        date: new Date().toISOString().slice(0, 10), // Current date in 'YYYY-MM-DD' format
        slots: slotsForAPI,      // Selected slots
        combopack: true            // Assuming you want combopack true, can be dynamic if needed
      };

      try {
        const response = await axios.post('http://localhost:5000/book-slot', bookingData);

        if (response.status === 200) {
          console.log('Booking Successful:', response.data);
          navigate(`/booking/${gid}`);
        } else {
          console.log('Booking Failed:', response.data);
          alert('Booking failed, please try again.');
        }
      } catch (error) {
        console.error('Error during booking:', error);
        alert('An error occurred while booking. Please try again later.');
      }
    } else {
      alert('Please select at least one slot to book.');
    }
  };

  const handleSlotClick = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!ground) return <div>No ground data available</div>;

  const { name, location, data, slots } = ground;
  const imageUrl = data?.image || groundImage;
  const description = data?.desc || 'No Description';
  const bookedSlots = slots?.booked || [];
  const allSlots = ['6.0', '6.5', '7.0', '7.5', '8.0', '8.5', '9.0', '9.5', '10.0', '10.5', '11.0', '11.5', '12.0', '12.5'];
  const bookedSlotTimes = bookedSlots.map(formatSlot);
  const availableSlots = allSlots.filter((slot) => !bookedSlots.includes(slot)).map(formatSlot);

  return (
    <section className='viewgroundsection my-3'>
      <div className="container">
        <div className="row">
          {/* Ground details (visible for both desktop and mobile) */}
          <div className="col-12 col-lg-8">
            <h4>{name}</h4>
            <div>
              <DatePicker
                selected={selectedDate}
                onChange={(date) => {
                  if (date) {
                    setSelectedDate(date);
                  }
                }}
                dateFormat="MMMM d, yyyy"
                className="form-control"
              />

              <p><strong>Selected Date: </strong>{formatDate(selectedDate)}</p>
            </div>
            <div className="d-flex justify-content-between">
              <div className="w-50 text-center">
                <h6>Available Slots:</h6>
                <ul className="list-unstyled">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                      <li key={index}>
                        <button
                          type="button"
                          className={`btn btn-sm m-1 ${selectedSlots.includes(slot) ? 'btn-success' : 'btn-primary'}`}
                          onClick={() => handleSlotClick(slot)}
                        >
                          {slot}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li>No available slots</li>
                  )}
                </ul>
              </div>
              <div className="w-50 text-center">
                <h6>Booked Slots:</h6>
                <ul className="list-unstyled">
                {bookings.length > 0 ? (
                bookings.map((slot, index) => (
                  <li key={index}>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm m-1"
                      disabled
                    >
                      {formatSlot(slot)}
                    </button>
                  </li>
                ))
              ) : (
                <li>No booked slots</li>
              )}
                </ul>
              </div>
            </div>
          </div>

          {/* Image for Desktop */}

          <div className="col-lg-4 d-none d-lg-block text-center">

            <div class="card w-100" >
              <img src={imageUrl} alt="ground" className="ground-image img-fluid mb-3" />
              <div class="card-body">
                <h5 className='card-title'>{name || 'No Name'}</h5>
                <h5 className='card-title'>Location: {location || 'No Location'}</h5>
                <p class="card-text">{description}</p>
                <a href="#" class="btn btn-primary">Go somewhere</a>
              </div>
            </div>
          </div>

          {/* Image for Mobile */}
          <div className="col-12 d-lg-none d-sm-block d-md-block mb-4">
            <div className=" text-center my-3">
              <button
                type="button"
                className="btn btn-danger btn-lg w-100 "
                onClick={confirnnowClick}
              >
                Confirm Now
              </button>
            </div>
            <div className="text-center">
              <div class="card w-100" >
                <img src={imageUrl} alt="ground" className="ground-image img-fluid mb-3" />
                <div class="card-body">
                  <h5 className='card-title'>{name || 'No Name'}</h5>
                  <h5 className='card-title'>Location: {location || 'No Location'}</h5>
                  <p class="card-text">{description}</p>
                  <a href="#" class="btn btn-primary">Go somewhere</a>
                </div>
              </div>
            </div>
          </div>
        </div>


        <div className="col-12 d-none d-lg-block text-center mt-3">
          <button
            type="button"
            className="btn btn-danger btn-lg w-50"
            onClick={confirnnowClick}
          >
            Confirm Now
          </button>
        </div>
        {/* BookModal component */}
        <BookModal showModal={showModal} handleCloseModal={handleCloseModal} />

      </div>
    </section>
  );
};

export default ViewGround;
