import { csrfFetch } from './csrf';

// Action types
const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const ADD_SPOT = 'spots/ADD_SPOT';
const REMOVE_SPOT = 'spots/REMOVE_SPOT';
const EDIT_SPOT = 'spots/EDIT_SPOT';

// Action creators
export const loadSpots = (spots) => ({
  type: LOAD_SPOTS,
  spots,
});

export const addSpot = (spot) => ({
  type: ADD_SPOT,
  spot,
});

export const removeSpot = (spotId) => ({
  type: REMOVE_SPOT,
  spotId,
});

export const editSpot = (spot) => ({
  type: EDIT_SPOT,
  spot,
});

// Thunk creators
export const getAllSpots = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots');
  if (response.ok) {
    const spotsData = await response.json();
    dispatch(loadSpots([...spotsData.spots]));
  }
};

export const getSpotDetails = (spotId) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spotId}`);
  if (res.ok) {
    const details = await res.json();
    dispatch(addSpot(details));
  }
};

export const createSpot = (spot) => async (dispatch) => {
  const res = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(addSpot(data));
    dispatch(getAllSpots(data));
    return data;
  }
};

export const updateSpot = (spot) => async (dispatch) => {
  const res = await csrfFetch(`/api/spots/${spot.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(spot),
  });

  if (res.ok) {
    const updatedSpot = await res.json();
    dispatch(editSpot(updatedSpot));
    return updatedSpot;
  }
};

export const deleteSpot = (spotId) => async (dispatch) => {
  try {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      throw res;
    }

    dispatch(removeSpot(spotId));
  } catch (err) {
    console.error(err);
  }
};

// Initial state
const initialState = {};

// Reducer
const spotsReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
        const loadState = {};
        action.spots.forEach((spot) => (loadState[spot.id] = spot));
        return { ...state, ...loadState };

    case ADD_SPOT:
      return { ...state, [action.spot.id]: action.spot };

    case REMOVE_SPOT:
      const newState = { ...state };
      delete newState[action.spotId];
      return newState;

    case EDIT_SPOT:
      const updatedSpot = action.spot.updateSpot;
      return { ...state, [updatedSpot.id]: updatedSpot };

    default:
      return state;
  }
};

export default spotsReducer;
