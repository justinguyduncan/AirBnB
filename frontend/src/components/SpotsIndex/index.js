import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllSpots } from '../../store/spots';
import SpotsIndexItem from '../SpotsIndexItem';
import './SpotsIndex.css';

function SpotsIndex() {
  const dispatch = useDispatch();
  const spots = useSelector(state => state.spots);
  const spotsArray = spots ? Object.values(spots) : [];

  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  return (
    <div className="spots-container">
      <ul className="spots-list">
        {spotsArray.map((spot) => (
          <SpotsIndexItem
            key={spot.id}
            spot={spot}
            previewImage={spot.previewImage}
          />
        ))}
      </ul>
    </div>
  );
}

export default SpotsIndex;
