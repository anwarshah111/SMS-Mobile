// App.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useSchoolStore from '../../zustand/schoolStore';
// import SchoolsDashboard from './SchoolsDashboard';

const SchoolHome = ({navigation}: any) => {
  const insets = useSafeAreaInsets();
  const schoolDetails = useSchoolStore(state => state.schoolDetails);
  // console.log(schoolDetails);
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />
      <View style={styles.container}>
        <View style={{...styles.header, paddingTop: insets.top}}>
          <View style={{width: '85%'}}>
            <Text style={styles.headerTitle} numberOfLines={3}>
              {schoolDetails?.name}
            </Text>
            <Text style={styles.headerSubtitle}>Welcome back, Admin</Text>
          </View>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => {
              navigation.navigate('SchoolProfileScreen');
            }}>
            <Icon name="account-circle" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Icon name="account-group" size={24} color="#4F46E5" />
              </View>
              <View>
                <Text style={styles.statNumber}>1,234</Text>
                <Text style={styles.statLabel}>Total Students</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Icon name="school" size={24} color="#4F46E5" />
              </View>
              <View>
                <Text style={styles.statNumber}>48</Text>
                <Text style={styles.statLabel}>Classes</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Icon name="account" size={24} color="#4F46E5" />
              </View>
              <View>
                <Text style={styles.statNumber}>87</Text>
                <Text style={styles.statLabel}>Teachers</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={styles.statIconContainer}>
                <Icon name="account-plus" size={24} color="#4F46E5" />
              </View>
              <View>
                <Text style={styles.statNumber}>23</Text>
                <Text style={styles.statLabel}>New students</Text>
              </View>
            </View>
          </View>

          {/* Recent Activities */}
          <Text style={styles.sectionTitle}>Recent Activities</Text>
          <View style={styles.activitiesCard}>
            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Icon name="account-plus" size={18} color="#4F46E5" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  New student registration: Sarah Johnson
                </Text>
                <Text style={styles.activityTime}>Today, 10:45 AM</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Icon name="check-circle" size={18} color="#22C55E" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  Registration approved: Michael Smith
                </Text>
                <Text style={styles.activityTime}>Today, 09:30 AM</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.activityItem}>
              <View style={styles.activityIconContainer}>
                <Icon name="calendar-check" size={18} color="#F59E0B" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityText}>
                  School event created: Annual Sports Day
                </Text>
                <Text style={styles.activityTime}>Yesterday, 03:15 PM</Text>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('RequestedStudents')}>
              <View
                style={[
                  styles.actionIconContainer,
                  {backgroundColor: '#EEF2FF'},
                ]}>
                <Icon name="account-plus" size={24} color="#4F46E5" />
              </View>
              <Text style={styles.actionText}>Register Student</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('ManageStudents')}>
              <View
                style={[
                  styles.actionIconContainer,
                  {backgroundColor: '#F0FDF4'},
                ]}>
                <Icon name="clipboard-list" size={24} color="#22C55E" />
              </View>
              <Text style={styles.actionText}>Manage Students</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard}>
              <View
                style={[
                  styles.actionIconContainer,
                  {backgroundColor: '#FEF3C7'},
                ]}>
                <Icon name="calendar" size={24} color="#F59E0B" />
              </View>
              <Text style={styles.actionText}>Schedule</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => {
                AsyncStorage.clear();
              }}>
              <View
                style={[
                  styles.actionIconContainer,
                  {backgroundColor: '#FEE2E2'},
                ]}>
                <Icon name="bell" size={24} color="#EF4444" />
              </View>
              <Text style={styles.actionText}>Notifications</Text>
            </TouchableOpacity>
          </View>

          {/* Upcoming Events */}
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          <View style={styles.eventCard}>
            <View style={styles.eventDateContainer}>
              <Text style={styles.eventMonth}>APR</Text>
              <Text style={styles.eventDay}>15</Text>
            </View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>Parent-Teacher Meeting</Text>
              <Text style={styles.eventTime}>09:00 AM - 12:00 PM</Text>
              <View style={styles.eventAttendees}>
                <View style={styles.attendeeBadge}>
                  <Text style={styles.attendeeText}>Grade 9-12</Text>
                </View>
                <Text style={styles.eventLocation}>Main Hall</Text>
              </View>
            </View>
          </View>

          <View style={styles.eventCard}>
            <View style={styles.eventDateContainer}>
              <Text style={styles.eventMonth}>APR</Text>
              <Text style={styles.eventDay}>22</Text>
            </View>
            <View style={styles.eventDetails}>
              <Text style={styles.eventTitle}>Annual Sports Day</Text>
              <Text style={styles.eventTime}>08:00 AM - 04:00 PM</Text>
              <View style={styles.eventAttendees}>
                <View style={styles.attendeeBadge}>
                  <Text style={styles.attendeeText}>All Students</Text>
                </View>
                <Text style={styles.eventLocation}>Sports Ground</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',

    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
    marginBottom: 16,
  },
  activitiesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: '#111827',
  },
  activityTime: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  actionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  eventDateContainer: {
    width: 50,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventMonth: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4F46E5',
  },
  eventDay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  eventDetails: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  eventTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  eventAttendees: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  attendeeBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  attendeeText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '500',
  },
  eventLocation: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default SchoolHome;
