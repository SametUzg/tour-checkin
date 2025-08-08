import * as Location from 'expo-location';

export const getLocation = async (): Promise<string | null> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
};
