import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  StatusBar,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import useStudentStore from '../../zustand/studentStore';
import useSchoolStore from '../../zustand/schoolStore';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const SchoolProfileScreen = ({navigation}: any) => {
  const insets = useSafeAreaInsets();
  const schoolData = useSchoolStore(state => state.schoolDetails);

  const openWebsite = () => {
    Linking.openURL(schoolData.website);
  };

  const handleLogout = () => {
    AsyncStorage.clear();
    useStudentStore.getState().resetStudentStore();
    useSchoolStore.getState().resetSchoolStore();
    navigation.reset({
      index: 0,
      routes: [{name: 'StudentLogin'}],
    });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const callSchool = () => {
    Linking.openURL(`tel:${schoolData.countryCode}${schoolData.contact}`);
  };

  const sendEmail = () => {
    Linking.openURL(`mailto:${schoolData.email}`);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header Section with Back Button */}
      <View style={{...styles.header, paddingTop: insets.top}}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerOverlay}>
          <Text style={styles.schoolName}>{schoolData.name}</Text>
          <View style={styles.boardContainer}>
            <Text style={styles.boardText}>{schoolData.board}</Text>
          </View>
        </View>
        {/* School Logo Section */}
        <View style={styles.logoContainer}>
          <Image
            source={{uri: 'https://picsum.photos/200'}}
            style={styles.logo}
          />
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Quick Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{schoolData.establishedYear}</Text>
            <Text style={styles.statLabel}>Established</Text>
          </View>
          <View style={[styles.statItem, styles.borderLeftRight]}>
            <Text style={styles.statValue}>{schoolData.studentCapacity}</Text>
            <Text style={styles.statLabel}>Capacity</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {new Date().getFullYear() - schoolData.establishedYear}
            </Text>
            <Text style={styles.statLabel}>Years</Text>
          </View>
        </View>

        {/* Main Content Section */}
        <View style={styles.contentContainer}>
          {/* Principal Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <MaterialIcons name="person" size={22} color="#4F46E5" />
              <Text style={styles.infoHeaderText}>Principal</Text>
            </View>
            <Text style={styles.infoValue}>{schoolData.principal}</Text>
          </View>

          {/* Location Info */}
          <View style={styles.infoSection}>
            <View style={styles.infoHeader}>
              <Ionicons name="location" size={22} color="#4F46E5" />
              <Text style={styles.infoHeaderText}>Address</Text>
            </View>
            <Text style={styles.infoValue}>{schoolData.address}</Text>
            <TouchableOpacity style={styles.mapButton}>
              <Text style={styles.mapButtonText}>View on Map</Text>
            </TouchableOpacity>
          </View>

          {/* Contact Info Section */}
          <View style={styles.contactSection}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <TouchableOpacity style={styles.contactItem} onPress={callSchool}>
              <View style={styles.contactIconContainer}>
                <Ionicons name="call" size={20} color="#fff" />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Phone</Text>
                <Text style={styles.contactValue}>
                  {schoolData.countryCode} {schoolData.contact}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem} onPress={sendEmail}>
              <View
                style={[
                  styles.contactIconContainer,
                  {backgroundColor: '#4CAF50'},
                ]}>
                <Ionicons name="mail" size={20} color="#fff" />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Email</Text>
                <Text style={styles.contactValue}>{schoolData.email}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.contactItem} onPress={openWebsite}>
              <View
                style={[
                  styles.contactIconContainer,
                  {backgroundColor: '#FF9800'},
                ]}>
                <Ionicons name="globe" size={20} color="#fff" />
              </View>
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactLabel}>Website</Text>
                <Text style={styles.contactValue} numberOfLines={1}>
                  {schoolData.website}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <FontAwesome name="calendar" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Events</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: '#4CAF50'}]}>
              <MaterialIcons name="photo-library" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>Gallery</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, {backgroundColor: '#FF9800'}]}>
              <FontAwesome name="newspaper-o" size={20} color="#fff" />
              <Text style={styles.actionButtonText}>News</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.resetButton} onPress={handleLogout}>
            <Feather name="log-out" size={20} color="#FF3B30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    height: 200,
    backgroundColor: '#4F46E5',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  backButton: {
    // position: 'absolute',
    // top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerOverlay: {
    padding: 20,
  },
  schoolName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  boardContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  boardText: {
    color: '#fff',
    fontWeight: '600',
  },
  logoContainer: {
    position: 'absolute',
    top: 160,
    right: 30,
    zIndex: 1,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
  },
  borderLeftRight: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#eeeeee',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4F46E5',
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  mapButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
  mapButtonText: {
    color: '#4F46E5',
    fontWeight: '500',
    fontSize: 13,
  },
  contactSection: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  contactIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactTextContainer: {
    flex: 1,
    marginLeft: 15,
  },
  contactLabel: {
    fontSize: 12,
    color: '#666',
  },
  contactValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: '600',
    marginLeft: 5,
    fontSize: 14,
  },
  resetButton: {
    marginTop: 24,
    marginHorizontal: 16,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  logoutText: {
    marginLeft: 4,
    color: '#FF3B30',
    fontWeight: '500',
  },
});

export default SchoolProfileScreen;
