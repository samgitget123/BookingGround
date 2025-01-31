import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useDispatch } from 'react-redux';
import { deletebooking } from '../../redux/features/cancelbookingSlice';
import { fetchGroundDetails } from '../../redux/features/groundSlice';
import { updateprice } from '../../redux/features/updatepriceSlice';
import { useNavigate } from "react-router-dom";
const BookDetailsModal = ({ showModal, handleCloseModal, selectedSlot, selectdate, ground_id }) => {
  const [bookingDetails, setBookingDetails] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const dispatch = useDispatch();
    const navigate = useNavigate();
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
  const handleEditAmount = () => {
    setNewAmount(bookingData?.book?.price || ""); // Set current amount in input
    setShowEditModal(true);
  };
 
  console.log(newAmount, 'newAmount before sending API request');
  console.log('Updating amount to:', newAmount);
console.log('Booking ID:', bookingData?.book?.booking_id);

  // const cancelbookingHandler=()=>{
  //   const bookingData = bookingDetails?.data?.[0];
    
  //   const booking_id = bookingData.book.booking_id
  //   const ground_id =  bookingData.ground_id
  //   console.log(booking_id, ground_id ,'canceldeleteparams')
  //   dispatch(deletebooking({booking_id,ground_id}))
   
  // }


// const cancelbookingHandler = async () => {
//   const bookingData = bookingDetails?.data?.[0];
//   const booking_id = bookingData.book.booking_id;
//   const ground_id = bookingData.ground_id;
//   console.log(booking_id, ground_id, 'canceldeleteparams');
  
//   try {
//     // Dispatch the deletebooking action and await the result
//     const result = await dispatch(deletebooking({ booking_id, ground_id }));
    
//     // If the deletion is successful, show a success alert
//     if (result?.payload?.success) {
//       Swal.fire({
//         icon: 'success',
//         title: 'Booking Deleted!',
//         text: 'Your booking has been successfully deleted.',
//       });
//     } else {
//       // If not successful, show an error alert
//       Swal.fire({
//         icon: 'error',
//         title: 'Error!',
//         text: result?.payload?.message || 'An error occurred while deleting the booking.',
//       });
//     }
//   } catch (error) {
//     // Handle any errors that may occur during the deletebooking action
//     Swal.fire({
//       icon: 'error',
//       title: 'Error!',
//       text: error.message || 'Failed to delete booking.',
//     });
//   }
// };


const cancelbookingHandler = async () => {
  const bookingData = bookingDetails?.data?.[0];
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
   // navigate(`/viewground/${ground_id}`);
  }
};

  // const handleSaveAmount = async () => {
  //   try {
  //     const updateUrl = `http://localhost:5000/api/booking/update-amount`;
  //     await axios.post(updateUrl, {
  //       booking_id: bookingData?.book?.booking_id,
  //       new_amount: newAmount
  //     });

  //     // Update UI instantly
  //     setBookingDetails(prevDetails => ({
  //       ...prevDetails,
  //       data: [
  //         {
  //           ...prevDetails.data[0],
  //           book: {
  //             ...prevDetails.data[0].book,
  //             price: newAmount
  //           }
  //         }
  //       ]
  //     }));

  //     setShowEditModal(false);
  //   } catch (error) {
  //     console.error("Error updating amount:", error);
  //   }
  // };
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
    <div className="modal fade show custom-backdrop" style={{ display: "block" }} tabIndex="-1" aria-labelledby="bookDetailsModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered">
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
                      <button className="btn btn-sm btn-success me-2" onClick={handleEditAmount}>
                    Edit Amount
                  </button>
                    </div>
                    <div>
                      <button className='btn btn-sm btn-danger' onClick={cancelbookingHandler}>Cancel</button>
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
 {/* Edit Amount Modal */}
 {showEditModal && (
        <div className="modal fade show custom-backdrop" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content" >
              <div className="modal-header">
                <h5 className="modal-title">Edit Amount</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <label><strong>New Amount:</strong></label>
                <input
                  type="number"
                  className="form-control mt-2"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" >Save</button>
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
