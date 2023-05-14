import React from "react";
import { Link } from "react-router-dom";
import "./SpotsIndex/SpotsIndex.css";

const SpotsIndexItem = ({ spot, previewImage }) => {
  return (
    <li key={`spot-${spot.id}`} className="spot-card">
      <Link to={`/spots/${spot.id}`}>
        <div
          className="spot-image-wrapper"
          style={{
            backgroundImage: `url(${previewImage})`,
            cursor: "pointer",
            borderRadius: "12px, 12px, 0, 0 ",
          }}
          title={spot.name}
          data-name={spot.name}
        ></div>
      </Link>
      <div className="spot-details">
        <div className="spot-info-wrapper">
          <span className="spot-info">
            {spot.city}, {spot.state}
          </span>
          {spot?.avgRating && (
            <div className="spot-rating">
              <div className="fa-solid fa-star"> {spot.avgRating.toFixed(1)}</div>
            </div>
          )}
        </div>
        <p>${spot.price} night</p>
      </div>
    </li>
  );
};

export default SpotsIndexItem;
