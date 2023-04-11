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
            borderRadius: "12px",
          }}
          title={spot.name}
          data-name={spot.name}
        ></div>
      </Link>
      <span className="spot-info">
        {spot.city}, {spot.state}{" "}
        {spot?.avgRating && (
          <i className="fa-solid fa-star"> {spot.avgRating.toFixed(1)}</i>
        )}
      </span>
      <p>${spot.price} night</p>
    </li>
  );

};

export default SpotsIndexItem;
