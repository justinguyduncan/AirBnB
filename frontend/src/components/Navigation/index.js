import React from 'react';
import { NavLink } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';
import './Navigation.css';
import AirbnbLogo from './logo';
import CreateSpot from '../CreateSpot/CreateSpot'; // import CreateSpot component here

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        <li>
          <Link to="/create-spot">Create a Spot</Link> {/* Use Link component */}
        </li>
        <li>
          <ProfileButton user={sessionUser} />
        </li>
      </>
    );
  } else {
    sessionLinks = (
      <li>
        <div className="session-links">
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </div>
      </li>
    );
  }

  return (
    <ul>
      <li>
        <Link exact to="/"> {/* Use Link component */}
          <AirbnbLogo />
        </Link>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
