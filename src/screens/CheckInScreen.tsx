import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Image,
  Alert,
  Picker,
  Platform,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { getLocation } from '../utils/getLocation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/StackNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'CheckIn'>;

const CheckInScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [location, setLocation] = useState<string | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Arrived');

  useEffect(() => {
    (async () => {
      const loc = await getLocation();
      setLocation(loc);
    })();
  }, []);

  const handleSelectImage = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert('Permission to access camera is required!');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!location || !imageUri || !status) {
      Alert.alert('Error', 'Please complete all fields.');
      return;
    }

    Alert.alert(
      'Confirm Check-In',
      'Are you sure you want to check in with this info?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
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

  return (
    <View style={styles.container}>
      <Text style={styles.label}>📍 Location:</Text>
      <Text>{location || 'Fetching location...'}</Text>

      <Text style={styles.label}>📷 Photo:</Text>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} />
      ) : (
        <Button title="Take a Photo" onPress={handleSelectImage} />
      )}

      <Text style={styles.label}>📌 Status:</Text>
      {Platform.OS === 'android' ? (
        <Picker selectedValue={status} onValueChange={(itemValue) => setStatus(itemValue)}>
          <Picker.Item label="Arrived" value="Arrived" />
          <Picker.Item label="Lost" value="Lost" />
          <Picker.Item label="Late" value="Late" />
        </Picker>
      ) : (
        <View style={styles.statusButtons}>
          {['Arrived', 'Lost', 'Late'].map((s) => (
            <TouchableOpacity key={s} onPress={() => setStatus(s)} style={styles.statusBtn}>
              <Text style={styles.statusBtnText}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <Button title="Submit Check-In" onPress={handleSubmit} />
    </View>
  );
};

export default CheckInScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontWeight: 'bold', marginTop: 20 },
  image: { width: '100%', height: 200, marginVertical: 10, borderRadius: 10 },
  statusButtons: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  statusBtn: { padding: 10, backgroundColor: '#eee', borderRadius: 5 },
  statusBtnText: { fontWeight: 'bold' },
});
