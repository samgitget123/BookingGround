import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useBaseUrl } from '../../Contexts/BaseUrlContext';
import { useDispatch } from 'react-redux';
import { deletebooking } from '../../redux/features/cancelbookingSlice';
import { fetchGroundDetails } from '../../redux/features/groundSlice';
import { updateprice } from '../../redux/features/updatepriceSlice';
import { CaptureandShare } from '../../watsappfeature/CaptureandShare';
import convertSlotToTimeRange from '../../helpers/ConvertSlotToTimeRange';
import { FaUser,  FaPhoneAlt,FaRegCalendarAlt, FaRegClock, FaRupeeSign  } from "react-icons/fa";
const BookDetailsModal = ({ showModal, handleCloseModal, selectedSlot, selectdate, ground_id }) => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const dispatch = useDispatch();
   const { baseUrl } = useBaseUrl();
  useEffect(() => {
    // This will run every time the modal opens (showModal is true) or the params change
    if (!showModal) return; // Don't run the effect if the modal isn't visible
    const getBookingDetails = async (ground_id, selectdate, selectedSlot) => {
      const url = `${baseUrl}/api/booking/bookdetails?ground_id=${ground_id}&date=${selectdate}&slot=${selectedSlot}`;
      console.log(url,'slotapi')
      try {
        const response = await axios.get(url);
        setBookingDetails(response.data); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching booking details:', error);
      }
    };
console.log(bookingDetails.data[0].slots,'bookingdetails')
    // Ensure all required params are available before making the API call
    if (ground_id && selectdate && selectedSlot) {
      getBookingDetails(ground_id, selectdate, selectedSlot);
    }

  }, [showModal, ground_id, selectdate, selectedSlot,showEditModal]); // Dependencies: this effect will run on these values' changes

  if (!showModal) return null; // Don't render the modal if showModal is false

  // Safely access the data
  const bookingData = bookingDetails?.data?.[0];
  const handleEditAmount = () => {
    setNewAmount(bookingData?.book?.price || ""); // Set current amount in input
    setShowEditModal(true);
    //alert(`new amount: ${newAmount}`)
  };
  const updateHandler = async () => {
    const bookingData = bookingDetails?.data?.[0];
  
    if (!newAmount || !bookingData?.book?.booking_id) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please provide a valid amount to update.',
      });
      return;
    }
  
    try {
      // Dispatch the updateprice action with required payload
      const response = await dispatch(updateprice({
        booking_id: bookingData.book.booking_id,
        newAmount: parseInt(newAmount, 10), // Ensure it's a number
        comboPack: false, // Default value, modify if needed
      }));
      
      // Handle response
      if (response.payload?.success) {
        Swal.fire({
          icon: 'success',
          title: 'Amount Updated!',
          text: 'The booking price has been successfully updated.',
        });
        
        setShowEditModal(false); // Close the modal
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.payload?.message || 'Failed to update the booking price.',
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update the price.',
      });
    }
    
  };
  
 
  console.log(newAmount, 'newAmount before sending API request');
  console.log('Updating amount to:', newAmount);
console.log('Booking ID:', bookingData?.book?.booking_id);

const cancelbookingHandler = async () => {
  const bookingData = bookingDetails?.data?.[0];
  console.log(bookingData, 'bookingData')
  const booking_id = bookingData.book.booking_id;
  const ground_id = bookingData.ground_id;
  console.log(booking_id, ground_id, 'canceldeleteparams');

  // Show a confirmation dialog first
  const result = await Swal.fire({
    title: 'Are you sure?',
    text: "Once deleted, you won't be able to recover this booking!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!',
  });

  // If the user confirms the deletion
  if (result.isConfirmed) {
    try {
      // Dispatch the deletebooking action and await the result
      const deleteResult = await dispatch(deletebooking({ booking_id, ground_id }));
      if(deleteResult){
        dispatch(fetchGroundDetails({ ground_id, date: selectdate }));
      }
      // If the deletion is successful, show a success alert
      if (deleteResult?.payload?.success) {
        
        Swal.fire({
          icon: 'success',
          title: 'Booking Deleted!',
          text: 'Your booking has been successfully deleted.',
        });
      
      } else {
        // If not successful, show an error alert
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: deleteResult?.payload?.message || 'An error occurred while deleting the booking.',
        });
      }
    } catch (error) {
      // Handle any errors that may occur during the deletebooking action
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: error.message || 'Failed to delete booking.',
      });
    }

  }
};

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
    console.log("Slot received in convertSlotToTimeRange:", slot); // Debugging

    if (!Array.isArray(slot) || slot.length === 0) {
        console.error("Unexpected slot format:", slot);
        return "Invalid Slot";
    }

    // Convert slot values to numbers
    let startSlot = parseFloat(slot[0]);  // First slot
    let endSlot = parseFloat(slot[slot.length - 1]) + 0.5;  // Last slot + 30 min to complete range

    if (isNaN(startSlot) || isNaN(endSlot)) {
        console.error("Invalid numeric slot values:", slot);
        return "Invalid Slot";
    }

    // Function to format time
    const convertToTime = (timeSlot) => {
        const hour = Math.floor(timeSlot);
        const minutes = timeSlot % 1 === 0 ? "00" : "30";
        const period = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;  

        return `${formattedHour}:${minutes} ${period}`;
    };

    return `${convertToTime(startSlot)} - ${convertToTime(endSlot)}`;
};





  return (
    <div className="modal fade show custom-backdrop" style={{ display: "block" }} tabIndex="-1" aria-labelledby="bookDetailsModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: "#006849" }}>
            <h5 className="modal-title text-light" id="bookDetailsModalLabel">Booking Details</h5>
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
                    <p><FaRegCalendarAlt size={20} className="me-1 text-secondary" />{selectdate}</p>
                  </div>
                  <div>
                    <p> <FaRegClock size={20} className="me-1 text-secondary" />{convertSlotToTimeRange(bookingDetails?.data[0]?.slots)}</p>
                  </div>
                </div>

                <div className='d-flex justify-content-between my-1'>
                  <div>
                    <p><FaUser size={20} className="me-1 text-secondary" />{bookingData.name}</p>
                  </div>
                  <div>
                    <p><a href={`tel:${bookingData.mobile}`} className="text-decoration-underline text-dark"><FaPhoneAlt size={20} className="me-1 text-secondary" />{bookingData.mobile}</a></p>
                  </div>

                </div>

                <div className='d-flex justify-content-between my-1'>
                    <div>
                    <p style={{paddingBottom:"1px"}}>Amount  <FaRupeeSign />{bookingData.book.price}/-</p>
                      <button className="btn btn-sm btn-success me-2" onClick={handleEditAmount}>
                    Edit Amount
                  </button>
                    </div>
                    <div>
                      <button className='btn btn-sm btn-danger' onClick={cancelbookingHandler}>Cancel</button>
                    </div>
                </div>
                {/* <button className="btn btn-primary" onClick={CaptureandShare}>Share on WhatsApp</button> */}

              </div>
            </div>
          </div>
          <div className="modal-footer" style={{ backgroundColor: "#006849" }}>
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>Close</button>
          </div>
          
        </div>
      </div>
 {/* Edit Amount Modal */}
 {showEditModal && (
        <div className="modal fade show custom-backdrop" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content" >
              <div className="modal-header" style={{ backgroundColor: "#006849",padding:"10px" }}>
                <h5 className="modal-title text-light">Edit Amount</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <label>New Amount:</label>
                <input
                  type="number"
                  className="form-control mt-2"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
              </div>
              <div className="modal-footer" style={{ backgroundColor: "#006849" }}>
                <button className="btn btn-primary" onClick={updateHandler} >Save</button>
                <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
      
    </div>
    
  );
};

export default BookDetailsModal;
