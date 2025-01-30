import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loaderGif from "../../Images/loader.gif";
import SearchBar from "./requires/SearchBar";
import { useBaseUrl } from "../../Contexts/BaseUrlContext";
const CardComponent = ({ grounds }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage, setCardsPerPage] = useState(8);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(grounds); // Filtered data starts with all grounds
console.log(grounds, 'grounds');
const { baseUrl } = useBaseUrl();
console.log("Base URL:", baseUrl);
  useEffect(() => {
    setFilteredData(grounds); // Update filtered data whenever grounds change
  }, [grounds]);

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        setCardsPerPage(4);
      } else if (
        window.matchMedia("(min-width: 769px) and (max-width: 1028px)").matches
      ) {
        setCardsPerPage(8);
      } else {
        setCardsPerPage(12);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(filteredData.length / cardsPerPage);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredData.slice(indexOfFirstCard, indexOfLastCard); // Use filteredData for slicing
console.log(currentCards , 'currencards');
  const handleSearch = (results) => {
    setFilteredData(results); // Update the filtered data
    setCurrentPage(1); // Reset to the first page after filtering
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const navigate = useNavigate();
  const handleCardClick = (gid) => {
    navigate(`/viewground/${gid}`, { state: gid });
  };

  return (
    <div className="my-3">
      <div>
        <SearchBar data={grounds} onSearch={handleSearch} />
      </div>
      {loading ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "300px" }}
        >
          <img
            src={loaderGif}
            alt="Loading..."
            className="img-fluid loadergifimage"
          />
        </div>
      ):(
        <div className="row g-2">
          {currentCards && currentCards.length > 0 ? (
            currentCards.map((playground, index) => (
              <div className="col-lg-2 col-md-6 col-sm-12" key={index} onClick={() => handleCardClick(playground.ground_id)}>
              <div
                className="card shadow-lg border-0 rounded"
                style={{
                  width: "100%",
                 
                }}
              >
                <div
                  className="card-img-top"
                  style={{
                    height: "200px", // Set fixed height for the image container
                    backgroundColor: "#f0f0f0", // Fallback background for missing images
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {playground.data.photo ? (
                    <img
                      src={`${baseUrl}/uploads/${playground.data.photo}`}
                      alt={playground.data.name}
                      className="img-fluid"
                      style={{
                        height: "100%",
                        width: "100%",
                        objectFit: "cover", // Ensures image fits the container
                      }}
                    />
                  ) : (
                    <span>No Image Available</span> // Placeholder text for missing images
                  )}
                </div>
                <div className="card-body secondaryColor" >
                  <h4 className="card-title teritoryFont cardheadfont">
                    <i className="fa-thin fa-cricket-bat-ball"></i> {playground.data.name}
                  </h4>
                  <p className="card-text teritoryFont">
                    <i className="fas fa-map-marker-alt" style={{ color: "#00EE64" }}></i>{" "}
                    {playground.data.location}
                  </p>
                </div>
              </div>
            </div>
            
            ))
          ) : (
            <div className="col-12">
              <p className="text-center fw-bold text-secondary">No playgrounds available.</p>
            </div>
          )}
        </div>
      )}
      {currentCards.length > 0 && (
        <div className="row justify-content-center mt-4">
          <div className="col-md-6 d-flex justify-content-between">
            <button
              className="btn btn-sm secondaryColor teritoryFont"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <button
              className="btn btn-sm secondaryColor teritoryFont"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardComponent;
