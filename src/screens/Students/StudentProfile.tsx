import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import useStudentStore from '../../zustand/studentStore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentProfileScreen = ({navigation}: any) => {
  const studentDetails = useStudentStore(state => state.studentDetails);
  const [studentData, setStudentData] = useState({
    studentName: 'Sarah Johnson',
    grade: '10th Grade',
    schoolName: 'Westview High School',
    profilePicture: 'https://via.placeholder.com/150',
  });

  const handleLogout = () => {
    // Implement logout functionality
    AsyncStorage.removeItem('@STUDENT_ID');
    AsyncStorage.removeItem('@STUDENT_MOBILE_NUMBER');
    AsyncStorage.removeItem('@STUDENT_COUNTRY_CODE');
    useStudentStore.getState().resetStudentStore();
    navigation.reset({
      index: 0,
      routes: [{name: 'StudentLogin'}],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Picture Section */}
        <View style={styles.profileImageContainer}>
          <Image
            source={{uri: studentData.profilePicture}}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Icon name="camera" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Student Information Section */}
        <View style={styles.infoContainer}>
          <View style={styles.infoCard}>
            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Student Name</Text>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>
                  {studentDetails?.studentName}
                </Text>
                {/* <TouchableOpacity>
                  <Icon name="edit-2" size={16} color="#007AFF" />
                </TouchableOpacity> */}
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>Grade</Text>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>{studentDetails?.grade}</Text>
                {/* <TouchableOpacity>
                  <Icon name="edit-2" size={16} color="#007AFF" />
                </TouchableOpacity> */}
              </View>
            </View>

            <View style={styles.separator} />

            <View style={styles.infoField}>
              <Text style={styles.infoLabel}>School Name</Text>
              <View style={styles.infoValueContainer}>
                <Text style={styles.infoValue}>
                  {studentDetails?.school?.name}
                </Text>
                {/* <TouchableOpacity>
                  <Icon name="edit-2" size={16} color="#007AFF" />
                </TouchableOpacity> */}
              </View>
            </View>
          </View>
        </View>

        {/* Additional Actions */}
        <TouchableOpacity style={styles.resetButton} onPress={handleLogout}>
          <Icon name="log-out" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 4,
    color: '#FF3B30',
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 24,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#E1E2E6',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: '#007AFF',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  infoContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoField: {
    paddingVertical: 14,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 6,
  },
  infoValueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#212529',
  },
  separator: {
    height: 1,
    backgroundColor: '#EFEFEF',
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
  resetButtonText: {
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 16,
  },
});

export default StudentProfileScreen;
