import React from 'react';
import Banner from '../components/Banner/Banner';
import FloatingActionButtons from '../components/FloatingActionButtons/FloatingActionButtons';
import StoneCollection from '../components/StoneCollection/StoneCollection';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      <Banner />
      <div className="cta-section">
        <button className="cta-button">
          Thêm bố cục hoặc khối được xây dựng sẵn
        </button>
      </div>
      <StoneCollection />
      <FloatingActionButtons />
    </div>
  );
};

export default Home;

