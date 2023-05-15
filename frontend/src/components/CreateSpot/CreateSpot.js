import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createSpot } from '../../store/spots';
import './CreateSpot.css';

const CreateSpot = ({spot = {}, match}) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const [errors, setErrors] = useState({});
    // const spotId = match.params.spotId;





    const [address, setAddress] = useState(spot.address || '');
    const [city, setCity] = useState(spot.city || '');
    const [state, setState] = useState(spot.state || '');
    const [country, setCountry] = useState(spot.country || '');
    // const [lat, setLat] = useState(spot.lat || 0);
    // const [lng, setLng] = useState(spot.lng || 0);
    const [name, setName] = useState(spot.name || '');
    const [description, setDescription] = useState(spot.description || '');
    const [price, setPrice] = useState(spot.price || 0);
    const [previewImage, setPreviewImage] = useState(spot.previewImage || '');

    const handleSubmit = async (e) => {
        console.log('handleSubmit is being called');
        e.preventDefault();

        const newSpotInput = {
            ...spot,
            name: name,
            address: address,
            city: city,
            state: state,
            country: country,
            // lat: lat,
            // lng: lng,
            description: description,
            price: price,
            previewImage: previewImage
        };

        console.log(newSpotInput)
        try {
            let newSpot = await dispatch(createSpot(newSpotInput));
            if (newSpot.errors) {
                setErrors(newSpot.errors);
            } else {
                history.push(`/spots/${newSpot.id}`);
                setName('');
                setAddress('');
                setCity('');
                setState('');
                setCountry('');
                // setLat(null);
                // setLng(null);
                setDescription('');
                setPrice(null)
                setPreviewImage('');
            }

        } catch (res) {
            const data = await res.json();
            if (data && data.errors) {
                const errorMessages = Object.values(data.errors);
                setErrors(errorMessages);
            } else if (data && data.message) {
                setErrors([data.message]);
            }
        }
    };







    return (
        <div className='createspot-form-container'>
        <form onSubmit={handleSubmit} className="create-form-layout">
            <h1 className='create-form-header'>Create A Spot</h1>
            <h2 className='create-form-header'>Where's your place located?</h2>
            <h4 className='create-form-header'>Guests will only get your exact address once they booked a reservation</h4>

            {Object.values(errors).map((error, idx) => (
                <div key={idx} style={{color: 'red'}}>
                    {typeof error === 'object' ? error.message : error}
                </div>
            ))}

            <label className='spot-label'>
                <h3>Name</h3>
                <input
                className='spot-input'
                type='text'
                placeholder='Name of your spot'
                value={name}
                onChange={e => setName(e.target.value)}
                 />
            </label>

            {/* <hr className='spot-line-break' /> */}

            <label className='spot-label'>
                <h3>Address</h3>
                <input
                className='spot-input'
                type='text'
                placeholder='Address'
                value={address}
                onChange={e => setAddress(e.target.value)}
                 />
            </label>



            <label className='spot-label'>
                <h3>City</h3>
                <input
                className='spot-input'
                type='text'
                placeholder='City'
                value={city}
                onChange={e => setCity(e.target.value)}
                 />
            </label>



            <label className='spot-label'>
                <h3>State</h3>
                <input
                className='spot-input'
                type='text'
                placeholder='State'
                value={state}
                onChange={e => setState(e.target.value)}
                 />
            </label>



            <label className='spot-label'>
                <h3>Country</h3>
                <input
                className='spot-input'
                type='text'
                placeholder='Country'
                value={country}
                onChange={e => setCountry(e.target.value)}
                 />
            </label>

            {/* <hr className='spot-line-break' /> */}

            {/* <label className='spot-label'>
                <h3>Latitude</h3>
                <input
                className='spot-input'
                type='text'
                placeholder='Latitude'
                value={lat}
                onChange={e => setLat(e.target.value)}
                 />
            </label> */}



            {/* <label className='spot-label'>
                <h3>Longitude</h3>
                <input
                className='spot-input'
                type='text'
                placeholder='Longitude'
                value={lng}
                onChange={e => setLng(e.target.value)}
                 />
            </label> */}

            {/* <hr className='spot-line-break' /> */}

            <label className='spot-label'>
            <h3>Describe your place to guests</h3>
                <textarea
                className='spot-input'
                placeholder='Please write at least 30 characters'
                value={description}
                onChange={e => setDescription(e.target.value)}
                 />
            </label>



            {/* <hr className='spot-line-break' /> */}

            <label className='spot-label'>
                <h3>
                Price per night

                </h3>
               <input
                className='spot-input'
                type='text'
                placeholder='Price per night (USD)'
                value={price}
                onChange={e => setPrice(e.target.value)}
                 />
            </label>
            {/* <hr className='spot-line-break' /> */}


            <label className='spot-label'>
            <h3>Preview Image</h3>
                <input
                className='spot-input'
                placeholder='Preview Image URL'
                type="text"
                value={previewImage}
                onChange={e => setPreviewImage(e.target.value)}
                />
            </label>

            {/* <hr className='spot-line-break' /> */}

            <button
            className='submit-spot'
            type="submit">
                Create Spot
            </button>

        </form>
        </div>
    )

}


export default CreateSpot;
