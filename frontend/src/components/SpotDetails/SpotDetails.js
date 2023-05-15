import React from "react";
import { useParams, useHistory, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState} from "react";
import { getSpotDetails, deleteSpot } from "../../store/spots";
import { useModal } from "../../context/Modal";
import { getAllReviews} from "../../store/reviews";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import CreateReviewModal from "../CreateReviewModal/CreateReviewModal";
import "./SpotDetails.css";


const SpotDetails = ({spot}, match) => {
    const dispatch = useDispatch();
    const {spotId} = useParams();
    const spots = useSelector(state => state.spots[spotId]);
    const [spotDetails, setSpotDetails] = useState(null);


    const reviews = useSelector(state => state.reviews);
    const filteredReviews = Object.values(reviews).filter((review) => review?.spotId === spots?.id)

    const sessionUser = useSelector(state => state.session.user);

    const sessionUserId = useSelector(state => state.session.user?.id);

    // Searches if the spot belongs to the owner
    const isCurrentUserHost = spots?.ownerId === sessionUserId;

    const hasUserReviewed = filteredReviews.some((review) => review.userId === sessionUserId);

    const {setModalContent} = useModal();

    // Render spot details and its reviews
    useEffect(() => {
        dispatch(getSpotDetails(spotId));
      }, [dispatch, spotId]);

      useEffect(() => {
        dispatch(getAllReviews(spotId));
      }, [dispatch, spotId]);

      useEffect(() => {
        const fetchSpotDetails = async () => {
          try {
            // Your fetch code here, e.g.,
            const response = await fetch(`/api/spots/${spotId}`);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setSpotDetails(data);
          } catch (error) {
            console.error('Failed to fetch spot details:', error);
          }
        };
        console.log(spotDetails)
        fetchSpotDetails();
      }, [spotId]);

    // Delete Review modals
    const [showModal, setShowModal] = useState(false);

    const openModal = () => {
        setShowModal(true);
    }

    const closeModal = () => {
        setShowModal(false);
    }

    // Add Review Modal useState
    const [showAddReviewModal, setShowAddReviewModal] = useState(false);

    // Create Review Modal useState
    const [isReviewFormVisible, setIsReviewFormVisible] = useState(false);


    // Delete a review
    const handleDeleteReview =  async (reviewId, spotId) => {
        setModalContent(<DeleteReviewModal reviewId={reviewId} spotId={spotId} />);
        openModal();
    }

    // console.log(filteredReviews)

    // Add Review Modal
   const handleAddReviewModal = async () => {

    setModalContent(<CreateReviewModal spotId={spotId} />)
    openModal();
   }

   const handleReserveClick = () => {
    alert("Feature coming soon!");
  };

  const reviewCount = filteredReviews.length;
let reviewText = "";

if (reviewCount === 0) {
  reviewText = " New ";
} else if (reviewCount === 1) {
  reviewText = " 1 Review";
} else if (reviewCount === 2) {
  reviewText = " 2 Reviews";
} else {
  reviewText = `${reviewCount} Reviews`;
}


if (!spotDetails) {
  return <div>Loading...</div>;
}
    return (
<div>
    {spots && spots.Owner && (
      <div>
        <h2 className="detail-spot-name">{spots.name}</h2>
        <p className="spot-location">{spots.city}, {spots.state}, {spots.country}</p>
        <div className="image-container">
  {spots.SpotImages && spots.SpotImages.length > 0 && (
    <>
      <div className="main-image">
        <img src={spots.SpotImages[0].url} alt="Spot Preview" />
      </div>
      <div className="grid-container">
        <div className="grid-item">
          <img src={spots.SpotImages[0].url} alt="Spot Preview" />
        </div>
        <div className="grid-item">
          <img src={spots.SpotImages[0].url} alt="Spot Preview" />
        </div>
        <div className="grid-item">
          <img src={spots.SpotImages[0].url} alt="Spot Preview" />
        </div>
        <div className="grid-item">
          <img src={spots.SpotImages[0].url} alt="Spot Preview" />
        </div>
      </div>
    </>
  )}
</div>


                    <h2 className="detail-host">Hosted By {spots.Owner?.firstName} {spots.Owner?.lastName}</h2>
                    <p>{spots.description}</p>

                    <div className="reserve-container-wrapper">
                    </div>
                        <div className="reserve-container">

                        <div className="reserve-info">
                        <span>${spots.price} night</span>
                             <div className="reserve-rating">
                               {spots?.avgRating !== 0.0 && (
                                  <>
                                    <i className="fa-solid fa-star"> </i>
                                    <span> {spots.avgRating.toFixed(1) } </span> ·
                                 </>
                                )}
                               {reviewText}
                              </div>
                            </div>

                        <div>
                        <button className="reserve-button" onClick={handleReserveClick}>
                             Reserve
                        </button>
                        </div>
                    </div>


                    <hr style={{borderWidth: "1px", borderColor: "black"}}/>

                    <div>

                    <h2>
                        <i className="fa-solid fa-star">  </i>
                     {spots.avgRating !== 0.0 && (
                       <>
                         <span>{spots.avgRating.toFixed(1)}</span> ·
                       </>
                     )}
                     {reviewText}
                    </h2>
                        <button
                        onClick={handleAddReviewModal}
                        className="add-review-modal-button"
                        disabled={!sessionUser || hasUserReviewed || isCurrentUserHost}

                        >Post Your Review</button>


                            {filteredReviews && (filteredReviews).map(review => (
                            <div key={review?.id}>
                            <p>{review?.User.firstName} {review.User.lastName}</p>
                            <p>{review?.review}</p>
                            <p>{review?.stars} stars</p>

                            <button
                            className="detail-review-delete"
                             onClick={() => handleDeleteReview(review.id, spots.id)} disabled={!sessionUser}>
                            Delete Review
                            </button>

                        </div>
                        ))}

                        {/* {sessionUser && (
                        <CreateReview spotId={spotId} />
                        )}
                        <button
                            onClick={handleAddReviewClick}
                            className="add-review-button"
                            disabled={!sessionUser || isCurrentUserHost}
                            >
                            Post Your Review
                        </button> */}

                        {/* {sessionUser && spotId && (
                            <CreateReviewModal spotId={spotId} />
                        )} */}

                    </div>



                </div>
            )}
        </div>
    )

}

export default SpotDetails;
