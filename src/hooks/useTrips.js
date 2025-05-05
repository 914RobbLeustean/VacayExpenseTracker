import { useApp } from '../contexts/AppContext';
import { CONSTANTS } from '../utils/constants';
import { DEFAULT_BUDGET_TEMPLATE } from '../data/defaultData';

export const useTrips = () => {
  const { trips, setTrips, activeTrip, setActiveTrip, setNotification } = useApp();

  const createTrip = (tripData) => {
    const trip = {
      id: `trip-${Date.now()}`,
      name: tripData.name,
      destination: tripData.destination,
      startDate: tripData.startDate,
      endDate: tripData.endDate,
      status: 'open',
      expenses: [],
      budget: { ...DEFAULT_BUDGET_TEMPLATE },
      createdAt: new Date().toISOString()
    };

    setTrips([...trips, trip]);
    setActiveTrip(trip);

    setNotification({
      type: 'success',
      message: `Trip "${trip.name}" created successfully!`
    });

    setTimeout(() => {
      setNotification(null);
    }, CONSTANTS.NOTIFICATION_TIMEOUT);

    return trip;
  };

  const closeTrip = (tripId) => {
    const updatedTrips = trips.map(trip => {
      if (trip.id === tripId) {
        return { ...trip, status: 'closed' };
      }
      return trip;
    });

    setTrips(updatedTrips);

    if (activeTrip && activeTrip.id === tripId) {
      const openTrip = updatedTrips.find(trip => trip.status === 'open');
      setActiveTrip(openTrip || null);
    }

    setNotification({
      type: 'info',
      message: 'Trip closed successfully'
    });

    setTimeout(() => {
      setNotification(null);
    }, CONSTANTS.NOTIFICATION_TIMEOUT);
  };

  const reopenTrip = (tripId) => {
    const updatedTrips = trips.map(trip => {
      if (trip.id === tripId) {
        return { ...trip, status: 'open' };
      }
      return trip;
    });

    setTrips(updatedTrips);

    setNotification({
      type: 'success',
      message: 'Trip reopened successfully'
    });

    setTimeout(() => {
      setNotification(null);
    }, CONSTANTS.NOTIFICATION_TIMEOUT);
  };

  return {
    trips,
    activeTrip,
    setActiveTrip,
    createTrip,
    closeTrip,
    reopenTrip
  };
};