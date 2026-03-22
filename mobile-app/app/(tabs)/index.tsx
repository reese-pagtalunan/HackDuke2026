import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import * as Location from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const LOCATION_TASK_NAME = 'background-location-task';
let foregroundSubscription = null;

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error("Background Location Error:", error);
    return;
  }
  if (data) {
    const { locations } = data;
    const currentLocation = locations[0];
    console.log("Got Background Location:", currentLocation.coords);
    // Send to backend here
  }
});

export default function HomeScreen() {
  const [status, setStatus] = useState('Checking permissions...');

  useEffect(() => {
    requestPermissionsAndStartTracking();
  }, []);

  const requestPermissionsAndStartTracking = async () => {
    try {
      // 1. Always request foreground first
      const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus !== 'granted') {
        setStatus('Foreground permission denied.');
        return;
      }

      try {
        // 2. Try to request background permissions
        // In the standard Expo Go app, THIS literally does not exist, so it will throw the Plist error!
        const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
        if (backgroundStatus !== 'granted') {
          setStatus('Background permission denied.');
          return;
        }

        // 3. If we succeeded, start the true background updates
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location.Accuracy.Highest, // Highest accuracy for constant tracking
          distanceInterval: 1, // Update every 1 meter
          timeInterval: 2000, // Update every 2 seconds (foreground/Android)
          deferredUpdatesInterval: 0, // Do not defer updates
          showsBackgroundLocationIndicator: true,
          foregroundService: {
            notificationTitle: "Background Location Active",
            notificationBody: "Tracking your location for Hi-Fives",
          } // Helpful for Android to keep it alive
        });

        setStatus('Background tracking setup complete! 🎉');
      } catch (bgError) {
        console.warn("Background tracking error (Expected Expo Go limitation):", bgError);
        setStatus("Foreground tracking active! \n(Background needs Custom Build)");

        // Fallback: Start classic foreground tracking so they can still test the logic!
        foregroundSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Highest,
            distanceInterval: 1, // Constantly update for any movement
            timeInterval: 2000 // Force an update every 2 seconds regardless
          },
          (location) => {
            console.log("Got Foreground Update:", location.coords);
          }
        );
      }
    } catch (err) {
      console.error("Setup error:", err);
      setStatus('An error occurred setting up tracking.');
    }
  };

  const stopTracking = async () => {
    try {
      const isTracking = await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME);
      if (isTracking) {
        await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      }

      if (foregroundSubscription) {
        foregroundSubscription.remove();
        foregroundSubscription = null;
      }

      setStatus('Tracking completely stopped.');
    } catch (error) {
      console.error("Error stopping tracking:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{status}</Text>
      <Text style={styles.subtext}>Check your terminal for coordinate updates.</Text>
      <Button title="Stop Tracking" onPress={stopTracking} color="red" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff'
  },
  text: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  subtext: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666'
  }
});
