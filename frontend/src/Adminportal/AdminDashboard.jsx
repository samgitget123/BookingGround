import React, { useEffect, useState } from "react";
import axios from "axios";
import { useBaseUrl } from "../Contexts/BaseUrlContext";
import * as XLSX from "xlsx";  // Import the XLSX library
import { deletebooking } from "../redux/features/cancelbookingSlice";
import { useDispatch } from "react-redux";
import DatePicker from "react-datepicker";  // Import the DatePicker component
import "react-datepicker/dist/react-datepicker.css";  // Import the CSS for the date picker
import Modal from 'react-bootstrap/Modal'; // Import the Bootstrap Modal

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredBookings, setFilteredBookings] = useState([]);
  const { baseUrl } = useBaseUrl();
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);  // State to hold the selected date
  const [loading, setLoading] = useState(false);  // Loading state
  const [selectedBooking, setSelectedBooking] = useState(null);  // State to hold selected booking for modal
  const [showModal, setShowModal] = useState(false); // Modal visibility state
  const dispatch = useDispatch();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    if (debouncedSearch) {
      handleSearch(debouncedSearch);
    } else {
      setFilteredBookings(bookings);
    }
  }, [debouncedSearch, bookings]);

  useEffect(() => {
    // Filter bookings based on the selected date
    if (selectedDate) {
      const filteredByDate = bookings.filter((booking) => {
        const bookingDate = new Date(booking.date);
        // Compare day, month, and year
        return (
          bookingDate.getDate() === selectedDate.getDate() &&
          bookingDate.getMonth() === selectedDate.getMonth() &&
          bookingDate.getFullYear() === selectedDate.getFullYear()
        );
      });
      setFilteredBookings(filteredByDate);
    } else {
      setFilteredBookings(bookings);  // Reset to all bookings if no date is selected
    }
  }, [selectedDate, bookings]);

  const fetchBookings = async () => {
    setLoading(true);  // Set loading to true before fetching data
    try {
      const response = await axios.get(`${baseUrl}/api/booking/getallbookings`);
      if (response.data.success && Array.isArray(response.data.data)) {
        setBookings(response.data.data);
        setFilteredBookings(response.data.data);
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);  // Set loading to false after fetching data
    }
  };

  const handleSearch = (searchTerm) => {
    const lowercasedSearchTerm = searchTerm.trim().toLowerCase();
    const filteredResults = bookings.filter((item) => {
      const mobileString = item.mobile ? item.mobile.toString() : '';
      return (
        item._id.toLowerCase().includes(lowercasedSearchTerm) ||
        item.ground_id.toLowerCase().includes(lowercasedSearchTerm) ||
        item.name.toLowerCase().includes(lowercasedSearchTerm) ||
        mobileString.includes(lowercasedSearchTerm)
      );
    });
    setFilteredBookings(filteredResults);
  };

  // Pagination Logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle Excel Download
  const handleDownloadExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(filteredBookings.map(booking => ({
      "Booking ID": booking._id,
      "Ground Id": booking.ground_id,
      "Name": booking.name,
      "Date": booking.date,
      "Mobile": booking.mobile,
      "Status": booking.paymentStatus
    })));


    // Add worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "Bookings");

    // Set cell width for better display
    const wscols = [
      { wch: 10 }, // Width of "Booking ID" column
      { wch: 10 }, // Width of "Ground ID" column
      { wch: 20 }, // Width of "Name" column
      { wch: 12 }, // Width of "Date" column
      { wch: 15 }, // Width of "Mobile" column
      { wch: 12 }, // Width of "Status" column
    ];
    ws["!cols"] = wscols;

    // Write the Excel file
    XLSX.writeFile(wb, "Bookings.xlsx");
  };

  const deleteId = (booking_id, ground_id) => {
    dispatch(deletebooking({ booking_id, ground_id }));
  };

  // Reset the date filter to show all bookings
  const resetDateFilter = () => {
    setSelectedDate(null);  // Reset selected date to null
    setFilteredBookings(bookings);  // Show all bookings again
  };

  // Open modal with booking details
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-3">Admin Dashboard - Booking Details</h2>
      
      {/* Search Box */}
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Booking ID, Ground Name, or User Name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Date Picker and Reset Button */}
      <div className="mb-3 d-flex align-items-center">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          placeholderText="Select a date"
        />
        <button
          className="btn btn-secondary ms-3"
          onClick={resetDateFilter}
        >
          Reset
        </button>
      </div>

      {/* Download Excel Button */}
      <div className="mb-3">
        <button className="btn btn-success" onClick={handleDownloadExcel}>Download Excel</button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && (
        <div className="table-responsive">
          {currentBookings.length === 0 ? (
            <div className="text-center my-4">
              <p>No data found</p>
            </div>
          ) : (
            <table className="table table-sm table-striped table-bordered">
              <thead className="table-dark">
                <tr className="text-center">
                  <th>Booking ID</th>
                  <th>Ground Id</th>
                  <th>Name</th>
                  <th>Date</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBookings.map((booking) => (
                  <tr key={booking._id} className="text-center">
                    <td>{booking.book.booking_id}</td>
                    <td>{booking.ground_id}</td>
                    <td>{booking.name}</td>
                    <td>{booking.date}</td>
                    <td>{booking.mobile}</td>
                    <td>{booking.paymentStatus}</td>
                    <td>
                      <button className="btn btn-primary btn-sm" onClick={() => handleViewBooking(booking)}>View</button>
                      <button className="btn btn-danger btn-sm ms-2" onClick={() => deleteId(booking._id, booking.ground_id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Pagination */}
      {filteredBookings.length > 0 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Modal */}
      {selectedBooking && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton style={{ backgroundColor: "#006849" }}>
            <Modal.Title className="text-light">Booking Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="d-flex justify-content-between flex-wrap">
              <div><p><strong>Booking ID:</strong> {selectedBooking.book.booking_id}</p></div>
              <div> <p><strong>Ground ID:</strong> {selectedBooking.ground_id}</p></div>
              
            </div>
            <div className="d-flex justify-content-between flex-wrap">
            <div><p><strong>Name:</strong> {selectedBooking.name}</p></div>
            <div><p><strong>Mobile:</strong> {selectedBooking.mobile}</p></div>
            </div>
            <div className="d-flex justify-content-between flex-wrap">
            <div><p><strong>Date of booking:</strong> {selectedBooking.date}</p></div>
           
            <p><strong>Total price: </strong> {selectedBooking.book.price}</p>
            </div>
            <div>
            <p><strong>Status:</strong> {selectedBooking.paymentStatus}</p>
            </div>
          </Modal.Body>
          <Modal.Footer style={{ backgroundColor: "#006849" }}>
            <button className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default AdminDashboard;
