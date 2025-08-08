import * as ImagePicker from 'expo-image-picker';

export const pickImageFromCamera = async (): Promise<string | null> => {
  const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

  if (!permissionResult.granted) {
    alert('Permission to access camera is required!');
    return null;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.7,
  });

  if (!result.canceled && result.assets.length > 0) {
    return result.assets[0].uri;
  }

  return null;
};
