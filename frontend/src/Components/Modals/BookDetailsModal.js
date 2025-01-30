import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BookDetailsModal = ({ showModal, handleCloseModal, selectedSlot, selectdate, ground_id }) => {
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // This will run every time the modal opens (showModal is true) or the params change
    if (!showModal) return; // Don't run the effect if the modal isn't visible

    const getBookingDetails = async (ground_id, selectdate, selectedSlot) => {
      const url = `http://localhost:5000/api/booking/bookdetails?ground_id=${ground_id}&date=${selectdate}&slot=${selectedSlot}`;
      console.log('API URL:', url);

      try {
        const response = await axios.get(url);
        console.log(response.data, 'bookingdata');
        setBookingDetails(response.data); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };

    // Ensure all required params are available before making the API call
    if (ground_id && selectdate && selectedSlot) {
      getBookingDetails(ground_id, selectdate, selectedSlot);
    }

  }, [showModal, ground_id, selectdate, selectedSlot]); // Dependencies: this effect will run on these values' changes

  if (!showModal) return null; // Don't render the modal if showModal is false

  // Safely access the data
  const bookingData = bookingDetails?.data?.[0];

  // If data is still being fetched, show a loading indicator
  if (!bookingData) {
    return (
      <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-labelledby="bookDetailsModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="bookDetailsModalLabel">Booking Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              <p>Loading booking details...</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

    // Round slot values to avoid precision issues
    slot[0] = Math.round(slot[0]);  // Round the hour to nearest integer
    slot[1] = Math.round(slot[1]);  // Round the half value (0 or 1)

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


  return (
    <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-labelledby="bookDetailsModalLabel" aria-hidden="true">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="bookDetailsModalLabel">Booking Details</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body">
            <div className="card">
              <div className="card-body">
                <div className="d-flex my-2">
                  <div>
                    <p>{bookingData.book.booking_id}</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between my-1">
                  <div>
                    <p><strong>Date: </strong> {selectdate}</p>
                  </div>
                  <div>
                    <p>{convertSlotToTimeRange(bookingData.slots)}</p>
                  </div>
                </div>

                <div className='d-flex justify-content-between my-1'>
                  <div>
                    <p>{bookingData.name}</p>
                  </div>
                  <div>
                    <p><strong>{bookingData.mobile}</strong></p>
                  </div>

                </div>

                <div className='d-flex justify-content-between my-1'>
                    <div>
                      <strong><p style={{paddingBottom:"1px"}}>Amount {bookingData.book.price}/-</p></strong>
                      <button className='btn btn-sm btn-success'>Edit Amount</button>
                    </div>
                    <div>
                      <button className='btn btn-sm btn-danger'>Cancel</button>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
