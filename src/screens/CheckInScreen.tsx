import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Alert,
  Platform,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getLocation } from '../utils/getLocation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CheckIn'>;

const CheckInScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [location, setLocation] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Arrived');
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const statusOptions = [
    { value: 'Arrived', label: 'Arrived', icon: '✅', color: '#4CAF50' },
    { value: 'Late', label: 'Late', icon: '⏰', color: '#FF9800' },
    { value: 'Lost', label: 'Lost', icon: '🤔', color: '#F44336' },
  ];

  useEffect(() => {
    (async () => {
      try {
        const loc = await getLocation();
        setLocation(loc);
      } catch (error) {
        setLocation('Location not available');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSelectImage = async () => {
    try {
      // Check camera permissions first
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Camera Permission Required',
          'This app needs camera access to take photos for check-in. Please enable camera permissions in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => {
                // On iOS, we can't directly open settings, but we can guide the user
                Alert.alert(
                  'How to Enable Camera',
                  'Go to Settings > Privacy & Security > Camera > Tour Check-In and enable it.',
                  [{ text: 'OK' }]
                );
              }
            }
          ]
        );
        return;
      }

      // Launch camera with iOS-optimized settings
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FULL_SCREEN,
        // iOS specific options
        base64: false,
        exif: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert(
        'Camera Error',
        'Unable to open camera. Please make sure camera permissions are granted and try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleSelectFromGallery = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          'Photo Library Permission Required',
          'This app needs access to your photo library to select photos for check-in.',
          [{ text: 'OK' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Gallery error:', error);
      Alert.alert('Error', 'Unable to access photo library.');
    }
  };

  const showPhotoOptions = () => {
    Alert.alert(
      'Select Photo',
      'Choose how you want to add a photo:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Take Photo', onPress: handleSelectImage },
        { text: 'Choose from Gallery', onPress: handleSelectFromGallery },
      ]
    );
  };

  const handleSubmit = async () => {
    if (!location || !imageUri || !status) {
      Alert.alert('Missing Information', 'Please fill in all fields.');
      return;
    }

    Alert.alert(
      'Confirm Check-In',
      'Are you sure you want to check in with this information?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setSubmitting(true);
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            setSubmitting(false);
            navigation.navigate('Status', {
              location,
              imageUri,
              status,
            });
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Getting location...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Check-In</Text>
          <Text style={styles.subtitle}>Check in to your tour location</Text>
        </View>

        {/* Location Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📍</Text>
            <Text style={styles.cardTitle}>Location</Text>
          </View>
          <Text style={styles.locationText}>{location}</Text>
        </View>

        {/* Photo Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📷</Text>
            <Text style={styles.cardTitle}>Photo</Text>
          </View>
          
          {imageUri ? (
            <View style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
              <TouchableOpacity style={styles.retakeButton} onPress={showPhotoOptions}>
                <Text style={styles.retakeButtonText}>Change Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.photoButton} onPress={showPhotoOptions}>
              <Text style={styles.photoButtonIcon}>📸</Text>
              <Text style={styles.photoButtonText}>Add Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📌</Text>
            <Text style={styles.cardTitle}>Status</Text>
          </View>
          
          <View style={styles.statusContainer}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusButton,
                  status === option.value && styles.statusButtonActive,
                  { borderColor: option.color }
                ]}
                onPress={() => setStatus(option.value)}
              >
                <Text style={styles.statusIcon}>{option.icon}</Text>
                <Text style={[
                  styles.statusText,
                  status === option.value && styles.statusTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, (!location || !imageUri) && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!location || !imageUri || submitting}
        >
          <LinearGradient
            colors={(!location || !imageUri) ? ['#ccc', '#ccc'] : ['#4CAF50', '#45a049']}
            style={styles.submitGradient}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Check-In</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

export default CheckInScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 18,
    marginTop: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  locationText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 24,
  },
  photoButton: {
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoButtonIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  photoButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  imageContainer: {
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 15,
  },
  retakeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    borderWidth: 2,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  statusIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
  statusTextActive: {
    fontWeight: 'bold',
  },
  submitButton: {
    marginTop: 20,
    borderRadius: 12,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
