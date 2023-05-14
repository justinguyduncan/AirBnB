import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";


import Navigation from "./components/Navigation";
import SpotsIndex from './components/SpotsIndex/index.js';
import SpotDetails from './components/SpotDetails/SpotDetails';
import CreateSpot from './components/CreateSpot/CreateSpot';
import EditSpot from './components/EditSpot/EditSpot';
import ManageSpots from './components/ManageSpots/ManageSpots';

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
                    <Route exact path ="/" component={SpotsIndex} />
                    <Route exact path="/spots/current" component={ManageSpots} />
                    <Route path="/spots/new" component={CreateSpot} />
                    <Route path="/spots/:spotId/edit" component={EditSpot} />
                    <Route exact path="/spots/:spotId" component={SpotDetails} />
        </Switch>
      )}
    </>
  );
}

export default App;
