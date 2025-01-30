// export default BookModal;
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {setObject} from '../../Features/objectSlice';
import { useBaseUrl } from "../../Contexts/BaseUrlContext";

const BookModal = ({
  showModal,
  handleCloseModal,
  selectedSlots = [],
  selectdate,
}) => {
  console.log(selectedSlots,'selectedslots')
  const { gid } = useParams();
  const navigate = useNavigate();
  const [info, setInfo] = useState("");
  const dispatch = useDispatch();
  const { bookingId, loading, error } = useSelector((state) => state.ground);
  const { baseUrl } = useBaseUrl();
  //const baseUrl = `http://localhost:5000`;
  //const baseUrl = `https://bookingapp-r0fo.onrender.com`;

  const handleBooking = async (gid, selectedSlots, selectdate) => {
    const bookingData = {
      ground_id: gid,
      date: selectdate,
      slots: selectedSlots,
    };

    try {
      const response = await fetch(`${baseUrl}/api/booking/book-slot`, {
        method: "POST", // Specify the method
        headers: {
          "Content-Type": "application/json", // Specify content type
        },
        body: JSON.stringify(bookingData), // Send bookingData as JSON string
      });

      // if (!response.ok) {
      //   throw new Error('Failed to book slot');
      // }

      const data = await response.json();
      console.log(data,'bookingdata');
      //navigate(`/payment/${gid}`, { state: data });
      if (data) {
        dispatch(setObject(data)); 
        setInfo(data.message);
      }
    } catch (error) {
      console.error("Error booking slot:", error);
    }
  };

  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = "hidden"; // Disable scrolling when modal is open
    } else {
      document.body.style.overflow = "auto"; // Re-enable scrolling when modal is closed
    }
  }, [showModal]);
  // Function to format a single slot
  // const formatslot = (selectedSlots) => {
  //   if (!Array.isArray(selectedSlots) || selectedSlots.length === 0) return ""; // Ensure selectedSlots is a valid array

  //   // Function to format time from 24-hour to 12-hour with AM/PM
  //   const formatTime = (hours, minutes) => {
  //     const period = hours >= 12 ? "PM" : "AM";
  //     const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  //     return `${formattedHours}:${minutes} ${period}`;
  //   };

  //   // Extract the first and last slots from the selectedSlots array
  //   const firstSlot = selectedSlots[0];
  //   const lastSlot = selectedSlots[selectedSlots.length - 1];

  //   // Get start time from the first slot
  //   const [startHours, startHalf] = firstSlot.split(".").map(Number);
  //   const startMinutes = startHalf === 0 ? "00" : "30";
  //   const startTime = formatTime(startHours, startMinutes);

  //   // Get end time from the last slot (end 30 minutes after the last slot)
  //   const [endHours, endHalf] = lastSlot.split(".").map(Number);
  //   const endTime = formatTime(
  //     endHours + (endHalf === 0 ? 0 : 1),
  //     endHalf === 0 ? "30" : "00"
  //   );

  //   // Return the formatted time range as one value
  //   return `${startTime} - ${endTime}`;
  // };
  const formatslot = (selectedSlots) => {
    if (!Array.isArray(selectedSlots) || selectedSlots.length === 0) return ""; // Ensure selectedSlots is a valid array
  
    // Function to format time from 24-hour to 12-hour with AM/PM
    const formatTime = (hours, minutes) => {
      const period = hours >= 12 ? "PM" : "AM";
      const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
      return `${formattedHours}:${minutes} ${period}`;
    };
  
    // Ensure that the selected slots are strings before splitting them
    const firstSlot = String(selectedSlots[0]);
    const lastSlot = String(selectedSlots[selectedSlots.length - 1]);
  
    // Check if the slots are in the expected format (e.g., '6.0', '6.5')
    const isValidSlot = (slot) => /^(\d+(\.\d+)?)$/.test(slot);
    
    if (!isValidSlot(firstSlot) || !isValidSlot(lastSlot)) {
      console.error("Invalid slot format detected.");
      return "Invalid slot format";
    }
  
    // Get start time from the first slot
    const [startHours, startHalf] = firstSlot.split(".").map(Number);
    const startMinutes = startHalf === 0 ? "00" : "30";
    const startTime = formatTime(startHours, startMinutes);
  
    // Get end time from the last slot (end 30 minutes after the last slot)
    const [endHours, endHalf] = lastSlot.split(".").map(Number);
    const endTime = formatTime(
      endHours + (endHalf === 0 ? 0 : 1),
      endHalf === 0 ? "30" : "00"
    );
  
    // Return the formatted time range as one value
    return `${startTime} - ${endTime}`;
  };
  
  return (
    <>
      {/* Conditionally apply Bootstrap classes based on showModal */}
      <div
        className={`modal fade ${showModal ? "show modal-animate" : ""}`}
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden={!showModal}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content shadow-lg rounded-3">
            <div className="modal-header  text-white" style={{backgroundColor: "#006849"}}>
              <h5 className="modal-title" id="exampleModalLabel">
                Booking Confirmation
              </h5>
              <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body text-center">
              <h6 className="mb-3">Your Selected Slots</h6>
              <div className="alert alert-info py-2">
                {selectedSlots.length > 0 ? (
                  <span>{formatslot(selectedSlots)}</span>
                ) : (
                  <span>No slots selected.</span>
                )}
              </div>
              <div className="my-3">
                <strong>Date:</strong> {selectdate}
              </div>
              {info && <div className="alert alert-success">{info}</div>}
              <p className="text-muted">
                Please review the details before confirming.
              </p>
            </div>
            <div className="modal-footer justify-content-between">
            <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={selectedSlots.length === 0}
                onClick={() => handleBooking(gid, selectedSlots, selectdate)}
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay to simulate Bootstrap modal backdrop */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default BookModal;
