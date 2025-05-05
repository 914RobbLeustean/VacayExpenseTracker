import React from 'react';
import { useApp } from '../../contexts/AppContext';
import TripSelectorModal from './TripSelectorModal';
import TripForm from './TripForm';

const TripManager = () => {
  const { showTripSelector, showNewTripForm } = useApp();
  
  return (
    <>
      {showTripSelector && <TripSelectorModal />}
      {showNewTripForm && <TripForm />}
    </>
  );
};

export default TripManager;