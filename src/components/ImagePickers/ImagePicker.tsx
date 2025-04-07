import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Modal,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

interface Props {
  visible: boolean;
  onClose: () => void;
  onImagePicked: (image: any) => void;
  multiple?: boolean;
  isProfileImage?: boolean;
}

const ImagePickerModal = ({
  visible,
  onClose,
  onImagePicked,
  multiple = false,
  isProfileImage = false,
}: Props) => {
  const pickImageFromGallery = () => {
    ImagePicker.openPicker({
      multiple,
      compressImageQuality: 1,
      mediaType: 'photo',
      width: isProfileImage ? 320 : 1125,
      height: isProfileImage ? 320 : 543,
      cropping: true,
      cropperCircleOverlay: isProfileImage,
      cropperToolbarTitle: 'Edit and Select',
    })
      .then(image => {
        onImagePicked(image);
        onClose();
      })
      .catch(() => onClose());
  };

  const pickImageFromCamera = () => {
    ImagePicker.openCamera({
      multiple,
      compressImageQuality: 1,
      mediaType: 'photo',
      width: isProfileImage ? 320 : 1125,
      height: isProfileImage ? 320 : 543,
      cropping: true,
      cropperCircleOverlay: isProfileImage,
      cropperToolbarTitle: 'Edit and Select',
    })
      .then(image => {
        onImagePicked(image);
        onClose();
      })
      .catch(() => onClose());
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.fullContainer}>
        <View style={styles.cardView}>
          <TouchableOpacity style={styles.galleryButtoNStyle} onPress={pickImageFromGallery}>
            <Text style={styles.galleryButtonTextStyle}>Choose from Gallery</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cameraButtonContainer} onPress={pickImageFromCamera}>
            <Text style={styles.cameraButtonTextStyle}>Take a Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.cameraButtonContainer}>
            <Text style={{color: 'red', fontSize: 16}}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  cardView: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  galleryButtoNStyle: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  galleryButtonTextStyle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
  cameraButtonContainer: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButtonTextStyle: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ImagePickerModal;
