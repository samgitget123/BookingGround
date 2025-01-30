import React from "react";
import banner1 from "../../../Images/crickbanner.jpg";
import banner2 from "../../../Images/bgcrick.jpg";
import banner3 from "../../../Images/banner.jpg";

const Carousels = () => {
  const banners = [banner1, banner2, banner3]; // Array of banner images
  return (
    <div
      id="carouselExample"
      className="carousel slide"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      <div className="carousel-inner">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={banner}
              className="d-block w-100"
              alt={`Slide ${index + 1}`}
            />
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="prev"
      >
        <span
          className="carousel-control-prev-icon"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExample"
        data-bs-slide="next"
      >
        <span
          className="carousel-control-next-icon"
          aria-hidden="true"
        ></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
};

export default Carousels;
