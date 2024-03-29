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

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);



  let sessionLinks;
  if (sessionUser) {
console.log(sessionUser)
  // console.log(sessionUser)
    sessionLinks = (
      <div className='nav-bar-links'>
        <ul>
          <NavLink to="/spots/new" className="create-spot-button">
            Create a Spot
          </NavLink>
          <ProfileButton user={sessionUser} />
        </ul>
      </div>
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
    <nav>
      <Link to="/">
        <AirbnbLogo />
      </Link>
        {isLoaded && sessionLinks}

    </nav>
  );
}

export default Navigation;
