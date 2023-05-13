import React from 'react';
import './Home.css';
import HomePromo from './HomePromo';
import Events from './Events/Events';
import Services from './Services/Services';

const Home = () => {
  return (
    <>
      <HomePromo />
      <div className="buttons-container">
        <button className="button">Events</button>
        <button className="button">Services</button>
      </div>
      <Events />
      <Services />
    </>
  );
};

export default Home;
