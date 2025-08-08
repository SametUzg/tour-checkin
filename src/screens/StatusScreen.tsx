import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView, StatusBar, TouchableOpacity } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/StackNavigator';
import { LinearGradient } from 'expo-linear-gradient';

type StatusScreenRouteProp = RouteProp<RootStackParamList, 'Status'>;

const StatusScreen = () => {
  const route = useRoute<StatusScreenRouteProp>();
  const navigation = useNavigation();
  const { location, imageUri, status } = route.params;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'Arrived':
        return { icon: '✅', label: 'Geldim', color: '#4CAF50', message: 'Başarıyla check-in yaptınız!' };
      case 'Late':
        return { icon: '⏰', label: 'Geç Kaldım', color: '#FF9800', message: 'Geç kaldığınız kaydedildi.' };
      case 'Lost':
        return { icon: '🤔', label: 'Kayboldum', color: '#F44336', message: 'Kaybolduğunuz bildirildi.' };
      default:
        return { icon: '📌', label: status, color: '#667eea', message: 'Check-in tamamlandı.' };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Check-In Tamamlandı</Text>
          <Text style={styles.subtitle}>{statusInfo.message}</Text>
        </View>

        {/* Success Card */}
        <View style={styles.successCard}>
          <View style={styles.successIconContainer}>
            <Text style={styles.successIcon}>🎉</Text>
          </View>
          <Text style={styles.successTitle}>Başarılı!</Text>
          <Text style={styles.successMessage}>
            Check-in işleminiz başarıyla tamamlandı. Tur rehberiniz bilgilendirildi.
          </Text>
        </View>

        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📌</Text>
            <Text style={styles.cardTitle}>Durum</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
            <Text style={styles.statusIcon}>{statusInfo.icon}</Text>
            <Text style={styles.statusLabel}>{statusInfo.label}</Text>
          </View>
        </View>

        {/* Location Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📍</Text>
            <Text style={styles.cardTitle}>Konum</Text>
          </View>
          <Text style={styles.locationText}>{location}</Text>
        </View>

        {/* Photo Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardIcon}>📷</Text>
            <Text style={styles.cardTitle}>Çekilen Fotoğraf</Text>
          </View>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('Home')}
          >
            <LinearGradient
              colors={['#4CAF50', '#45a049']}
              style={styles.actionGradient}
            >
              <Text style={styles.actionButtonText}>Ana Sayfaya Dön</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('CheckIn')}
          >
            <Text style={styles.secondaryButtonText}>Yeni Check-In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default StatusScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  successCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    padding: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  successIcon: {
    fontSize: 40,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    lineHeight: 24,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  statusIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  locationText: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 24,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
  },
  actionContainer: {
    marginTop: 20,
  },
  actionButton: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  actionGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
