import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';

type StatusScreenRouteProp = RouteProp<RootStackParamList, 'Status'>;

const StatusScreen = () => {
  const route = useRoute<StatusScreenRouteProp>();
  const { location, imageUri, status } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>✅ Check-In Completed</Text>

      <Text style={styles.label}>📍 Location:</Text>
      <Text style={styles.value}>{location}</Text>

      <Text style={styles.label}>📌 Status:</Text>
      <Text style={styles.value}>{status}</Text>

      <Text style={styles.label}>📷 Photo:</Text>
      <Image source={{ uri: imageUri }} style={styles.image} />
    </ScrollView>
  );
};

export default StatusScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 15,
  },
  value: {
    marginTop: 5,
    marginBottom: 10,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginTop: 10,
  },
});
