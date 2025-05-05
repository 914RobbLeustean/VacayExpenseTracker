import { useState } from 'react';
import { useApp } from '../contexts/AppContext';
import { CONSTANTS } from '../utils/constants';

export const useBudget = () => {
  const { trips, setTrips, activeTrip, setNotification } = useApp();
  const [editingBudget, setEditingBudget] = useState(false);

  const updateBudget = (newBudget) => {
    if (!activeTrip) return;

    const updatedTrips = trips.map(trip => {
      if (trip.id === activeTrip.id) {
        return { ...trip, budget: newBudget };
      }
      return trip;
    });

    setTrips(updatedTrips);
    setEditingBudget(false);
    
    setNotification({
      type: 'success',
      message: 'Budget updated successfully!'
    });

    setTimeout(() => {
      setNotification(null);
    }, CONSTANTS.NOTIFICATION_TIMEOUT);
  };

  return {
    editingBudget,
    setEditingBudget,
    updateBudget
  };
};