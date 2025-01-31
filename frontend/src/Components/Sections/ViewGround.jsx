import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import CartButtons from "../Buttons/CartButtons";
import BookModal from "../Modals/BookModal";
import { fetchGroundDetails } from '../../redux/features/groundSlice';
import axios from 'axios';
import { useBaseUrl } from "../../Contexts/BaseUrlContext";
import { useDispatch, useSelector } from "react-redux";
import BookDetailsModal from "../Modals/BookDetailsModal";
const ViewGround = () => {
  const { gid } = useParams();
  const bookingdetails = useSelector((state) => state.bookingdetails.setBookingData);
  const { ground, loading, error } = useSelector((state) => state.ground);
 console.log(ground?.data?.image, 'reduxground')
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [clickedslot, setClickedslot] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [grounddetails, setGrounddetails] = useState([]);
  const groundState = useSelector((state) => state.ground || {});
  // const bookingDetails = useSelector((state) => state.ground.bookingStatus);
  useEffect(() => {
    if (gid) {
      dispatch(fetchGroundDetails({ gid, date: selectedDate }));
    }
  }, [gid, selectedDate]);
  const { baseUrl } = useBaseUrl();
  // console.log(grounddetails,'grounddetails')
  const dispatch = useDispatch();
  const formatDate = (date) => {
    if (!(date instanceof Date)) {
      date = new Date(date);
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };
  
  const navigate = useNavigate();
  const groundslots = [
    { id: "1", slot: "6.0" },
    { id: "2", slot: "6.5" },
    { id: "3", slot: "7.0" },
    { id: "4", slot: "7.5" },
    { id: "5", slot: "8.0" },
    { id: "6", slot: "8.5" },
    { id: "7", slot: "9.0" },
    { id: "8", slot: "9.5" },
    { id: "9", slot: "10.0" },
    { id: "10", slot: "10.5" },
    { id: "11", slot: "11.0" },
    { id: "12", slot: "11.5" },
    { id: "13", slot: "12.0" },
    { id: "14", slot: "12.5" },
    { id: "15", slot: "13.0" },
    { id: "16", slot: "13.5" },
    { id: "17", slot: "14.0" },
    { id: "18", slot: "14.5" },
    { id: "19", slot: "15.0" },
    { id: "20", slot: "15.5" },
    { id: "21", slot: "16.0" },
    { id: "22", slot: "16.5" },
    { id: "23", slot: "17.0" },
    { id: "24", slot: "17.5" },
    { id: "25", slot: "18.0" },
    { id: "26", slot: "18.5" },
    { id: "27", slot: "19.0" },
    { id: "28", slot: "19.5" },
    { id: "29", slot: "20.0" },
    { id: "30", slot: "20.5" },
    { id: "31", slot: "21.0" },
    { id: "32", slot: "21.5" },
    { id: "33", slot: "22.0" },
    { id: "34", slot: "22.5" },
    { id: "35", slot: "23.0" },
    { id: "36", slot: "23.5" },
    { id: "37", slot: "24.0" },
    { id: "38", slot: "24.5" },
    { id: "39", slot: "25.0" },
    { id: "40", slot: "25.5" },
    { id: "41", slot: "26.0" },
    { id: "42", slot: "26.5" },
  ];
  const convertSlotToTimeRange = (slot) => {
    console.log("Received slot:", slot); // Debugging

    // Convert slot if it's a string like "6.0" or "7.5"
    if (typeof slot === "string") {
      const parsedSlot = slot.split(".").map(Number);
      if (parsedSlot.length === 2) {
        slot = parsedSlot;  // Convert "6.0" → [6, 0], "6.5" → [6, 1]
      } else {
        console.error("Invalid slot format:", slot);
        return "Invalid Slot";
      }
    }

    // Ensure slot is an array with two numeric elements
    if (!Array.isArray(slot) || slot.length !== 2 || isNaN(slot[0]) || isNaN(slot[1])) {
      console.error("Invalid slot format:", slot);
      return "Invalid Slot";
    }

    const [hours, half] = slot;

    let startHour, startMinutes, endHour, endMinutes, period, endPeriod;

    // Determine the start time
    if (hours === 0 || hours === 24) {
      startHour = 12;
      startMinutes = half === 0 ? "00" : "30";
      period = "AM";
    } else if (hours > 0 && hours < 12) {
      startHour = hours;
      startMinutes = half === 0 ? "00" : "30";
      period = "AM";
    } else if (hours === 12) {
      startHour = 12;
      startMinutes = half === 0 ? "00" : "30";
      period = "PM";
    } else {
      startHour = hours - 12;
      startMinutes = half === 0 ? "00" : "30";
      period = "PM";
    }

    // Determine the end time
    if (half === 0) {
      endHour = hours;
      endMinutes = "30";
    } else {
      endHour = hours + 1;
      endMinutes = "00";
    }

    // Determine the end period
    if (endHour === 24) {
      endHour = 12;
      endPeriod = "AM";
    } else if (endHour === 12) {
      endPeriod = "PM";
    } else if (endHour > 12) {
      endHour -= 12;
      endPeriod = "PM";
    } else {
      endPeriod = "AM";
    }

    console.log(`Converted Time: ${startHour}:${startMinutes} ${period} - ${endHour}:${endMinutes} ${endPeriod}`);

    return `${startHour}:${startMinutes} ${period} - ${endHour}:${endMinutes} ${endPeriod}`;
  };



  ////////////////Fetch Ground details///////////////




  const calculateCurrentTime = (date) => {
    const now = new Date();
    const targetDate = new Date(date);
    if (
      targetDate.getFullYear() === now.getFullYear() &&
      targetDate.getMonth() === now.getMonth() &&
      targetDate.getDate() === now.getDate()
    ) {
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      return currentHours + currentMinutes / 60;
    }
    return 0; // For future dates, no restriction on time
  };


  // Example function to format slot
  const formatSlot = (slot) => {
    // Implement your formatSlot function here
    return slot; // Example: return formatted slot
  };
  // Create bookedslotsbydate from bookings array
  //const bookedslotsbydate = ground.slots.booked.map(formatSlot);
  const bookedslotsbydate = ground?.slots?.booked?.map(formatSlot) || [];

  console.log(bookings, 'bookings'); // Check the structure of the bookings array

  console.log(bookedslotsbydate, 'bookedslots');

  // Then, filter available slots
  const availableSlots = groundslots
    .filter((slot) => !bookedslotsbydate.includes(slot.slot))
    .map((slot) => slot.slot);
  console.log(availableSlots, 'availableSlots')
  const handleSlotClick = (slot) => {
    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot));
    } else {
      setSelectedSlots([...selectedSlots, slot]);
    }
  };
console.log(availableSlots, bookedslotsbydate , 'allslots')
  const confirnnowClick = () => {
    setShowModal(true);
  };

  const openModal = (slot) => {
    setClickedslot(slot);
    setShowBookingModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  const handleCloseModal = () => {
    setShowModal(false); // Close the modal
    setSelectedSlots([]);
  };
  // const handleCloseBookingModal = () => {
  //   setShowBookingModal(false); // Close the modal
  // };
  // console.log(grounddetails, 'image')

  ////open booking details///
  const openBookingDetails = (slot) => {
    navigate(`/bookingdetails/${slot}`, { state: slot });
  };
  const handleOpenModal = (slot) => {
    setClickedslot(slot); // Set the selected slot
    setShowBookingModal(true); // Open the modal
  };

  const handleClosebookingModal = () => {
    setShowBookingModal(false); // Close the modal
    setClickedslot(null); // Reset selected slot
  };
  /////Get booking details////

  return (
    <section className="viewcardbg">
      <div className="selectdatesection">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-md-12 col-sm-12">
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
              </div>
            </div>
          </div>
          <div>
            <p>
              <strong>Selected Date: </strong>
              {formatDate(selectedDate)}
            </p>
          </div>
        </div>
      </div>
      <div className="container-fluid pt-3">
        {/* Available Slots Section */}
        <div className="Carticon d-sm-none d-flex justify-content-center my-3">
          <CartButtons onClick={confirnnowClick} />
        </div>

        <div className="row">
          <div className="col-lg-9 col-sm-12 col-md-12">
            <div
              className="d-flex  justify-content-evenly justify-content-md-start flex-wrap mb-3" style={{ backgroundColor: "#006849" }}
            >
              <div>
                <h6 className="teritoryFont text-light text-center mt-3">
                  Available Slots:
                </h6>
                <ul className="list-unstyled d-flex flex-wrap flex-column flex-sm-row slotboxes">
                  {availableSlots.length > 0 ? (
                    availableSlots.map((slot, index) => (
                      <li key={index} className="listbox m-1">
                        <button
                          className={`btn ${selectedSlots.includes(slot) ? "btn-success" : "btn-primary"
                            } btn-sm availablebtn`}
                          onClick={() => handleSlotClick(slot)}
                          disabled={
                            // If the date is in the past, disable all slots except booked ones
                            (new Date(selectedDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) &&
                              !bookedslotsbydate.includes(slot)) ||
                            // If the slot is earlier than the current time (for today)
                            (new Date(selectedDate).setHours(0, 0, 0, 0) === new Date().setHours(0, 0, 0, 0) &&
                              parseFloat(slot) < calculateCurrentTime(selectedDate))
                          }
                        >
                          {convertSlotToTimeRange(slot)}
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="teritoryFont">No available slots</li>
                  )}
                </ul>
              </div>
              <div className="mt-sm-3 d-flex ">
                <div className="text-center">
                  <h6 className="text-light mt-3">Booked Slots:</h6>
                  <ul className="list-unstyled d-flex flex-wrap flex-column flex-sm-row text-center slotboxes">
                    {bookedslotsbydate.length > 0 ? (
                      bookedslotsbydate.map((slot, index) => (
                        <li key={index} className="listbox m-1 text-center" >
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm availablebtn"
                            onClick={() => handleOpenModal(slot)}
                          >
                            {convertSlotToTimeRange(slot)}
                            {/* Format if needed */}
                          </button>
                        </li>
                      ))
                    ) : (
                      <li className="text-danger text-center nobookedslots m-1">
                        No booked slots
                      </li>
                    )}
                  </ul>
                </div>
              </div>

            </div>
          </div>
          <div className="col-lg-3 col-md-12 col-sm-12 col-xs-12 col-xlg-6 g-0  ">
          <div className="card shadow-lg border-0 w-80 rounded secondaryColor viewcardFont  mx-auto">
              <div className="mobileconfirmnow Carticon  d-flex justify-content-center my-3">
                <CartButtons onClick={confirnnowClick} count={selectedSlots}/>
              </div>
              <div className="d-flex justify-content-center">
                <img
                 src={`${baseUrl}/uploads/${ground?.data?.image}`}
                  className="card-img-top ground-image img-fluid mb-3"
                  //alt={name || "Ground Image"}
                  style={{ width: '300px', height: '200px' }}
                />
              </div>
              <div className="card-body text-center">
                <h5 className="card-title">{ground?.name}</h5>
                <h6 className="card-subtitle mb-2 viewcardFont">
                  Location: {ground?.location}
                </h6>
                <p className="card-text viewcardFont">{ground?.data?.desc}</p>
              </div>
            </div>
        
     
   

          </div>
        </div>
        {/* Modal */}


      </div>

      {/* Modal for Booking Confirmation */}

      <BookModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        selectedSlots={selectedSlots}
        selectdate={formatDate(selectedDate)}
        setSelectedSlots={setSelectedSlots}
        
      />

                    {/****************Book details************* */}
      <BookDetailsModal
        showModal={showBookingModal}
        handleCloseModal={handleClosebookingModal}
        selectedSlot={clickedslot} // Pass selected slot to modal
        selectdate={formatDate(selectedDate)}
        ground_id={gid}
       
      />

    </section>
  );
};

export default ViewGround;
