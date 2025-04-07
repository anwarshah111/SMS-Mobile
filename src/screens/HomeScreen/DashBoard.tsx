import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import {BlurView} from '@react-native-community/blur';

const {width} = Dimensions.get('window');

const DashBoard = () => {
  const insets = useSafeAreaInsets();
  const [studentName] = useState('Alex Johnson');
  const [schoolName] = useState('Westfield Academy');
  const [studentClass] = useState('Grade 10-B');
  const [attendanceStatus] = useState('Present'); // Can be 'Present', 'Absent', 'Late'

  const modules = [
    {
      id: 1,
      title: 'Attendance',
      icon: 'calendar-check',
      color: '#4C6EFF',
      gradient: ['#4C6EFF', '#6C8FFF'],
      notifications: 0,
    },
    {
      id: 2,
      title: 'Notes',
      icon: 'notebook-outline',
      color: '#FF6B6B',
      gradient: ['#FF6B6B', '#FF8E8E'],
      notifications: 3,
    },
    {
      id: 3,
      title: 'Class Details',
      icon: 'google-classroom',
      color: '#6C63FF',
      gradient: ['#6C63FF', '#8F89FF'],
      notifications: 0,
    },
    {
      id: 4,
      title: 'Fees',
      icon: 'cash-multiple',
      color: '#FFB74D',
      gradient: ['#FFB74D', '#FFCC80'],
      notifications: 1,
    },
    {
      id: 5,
      title: 'Exam Updates',
      icon: 'file-document-edit',
      color: '#4CAF50',
      gradient: ['#4CAF50', '#66BB6A'],
      notifications: 2,
    },
    {
      id: 6,
      title: 'Teachers',
      icon: 'account-group',
      color: '#9C27B0',
      gradient: ['#9C27B0', '#BA68C8'],
      notifications: 0,
    },
    {
      id: 7,
      title: 'Assignments',
      icon: 'clipboard-text-clock',
      color: '#FF5252',
      gradient: ['#FF5252', '#FF8A80'],
      notifications: 5,
    },
  ];

  const renderAttendanceBanner = () => {
    let statusGradient, iconName, progressValue;

    switch (attendanceStatus) {
      case 'Present':
        statusGradient = ['#4CAF50', '#81C784'];
        iconName = 'check-circle';
        progressValue = 95;
        break;
      case 'Absent':
        statusGradient = ['#F44336', '#E57373'];
        iconName = 'close-circle';
        progressValue = 0;
        break;
      case 'Late':
        statusGradient = ['#FF9800', '#FFB74D'];
        iconName = 'clock-alert';
        progressValue = 70;
        break;
      default:
        statusGradient = ['#4CAF50', '#81C784'];
        iconName = 'check-circle';
        progressValue = 95;
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
    });

    return (
      <LinearGradient
        colors={statusGradient}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.attendanceBanner}>
        <View style={styles.attendanceContent}>
          <View style={styles.attendanceLeft}>
            <View style={styles.circularProgress}>
              <Text style={styles.progressText}>{progressValue}%</Text>
            </View>
            <View style={styles.attendanceTextContainer}>
              <Text style={styles.attendanceTitle}>Today's Attendance</Text>
              <Text style={styles.attendanceStatus}>{attendanceStatus}</Text>
            </View>
          </View>
          <View style={styles.attendanceRight}>
            <View style={styles.dateContainer}>
              <Icon name="calendar" size={18} color="#FFF" />
              <Text style={styles.dateText}>{formattedDate}</Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    );
  };

  const renderModuleCard = (item, index) => {
    return (
      <TouchableOpacity key={item.id} style={[styles.moduleCard]}>
        <LinearGradient
          colors={item.gradient}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.iconGradient}>
          <Icon name={item.icon} size={26} color="#FFF" />
        </LinearGradient>
        <Text style={styles.moduleTitle}>{item.title}</Text>
        {item.notifications > 0 && (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationText}>{item.notifications}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#161B40" />

      <LinearGradient
        colors={['#161B40', '#303F9F']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.headerGradient}>
        <View style={{...styles.headerContent, paddingTop: insets.top}}>
          <View style={styles.userInfoSection}>
            <View style={styles.profileImageContainer}>
              <Image
                // source={require('./assets/student-avatar.png')}
                style={styles.profileImage}
              />
              <View style={styles.onlineIndicator} />
            </View>

            <View style={styles.textContainer}>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.studentName}>{studentName}</Text>
              <View style={styles.schoolInfoRow}>
                <Icon name="school" size={14} color="rgba(255,255,255,0.7)" />
                <Text style={styles.schoolName}>{schoolName}</Text>
                <View style={styles.classBadge}>
                  <Text style={styles.classText}>{studentClass}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="bell" size={22} color="#FFF" />
              <View style={styles.iconBadge}>
                <Text style={styles.badgeText}>3</Text>
              </View>
            </TouchableOpacity>

            {/* <TouchableOpacity style={styles.iconButton}>
              <Icon name="cog" size={22} color="#FFF" />
            </TouchableOpacity> */}
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {renderAttendanceBanner()}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dashboard</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Icon name="chevron-right" size={16} color="#4C6EFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.modulesGrid}>
          {modules.map((item, index) => renderModuleCard(item, index))}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All</Text>
            <Icon name="chevron-right" size={16} color="#4C6EFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.upcomingContainer}>
          <View style={styles.upcomingItem}>
            <LinearGradient
              colors={['#FF5252', '#FF8A80']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.upcomingIcon}>
              <Icon name="file-document" size={20} color="#FFF" />
            </LinearGradient>
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingName}>Mathematics Mid-Term</Text>
              <View style={styles.upcomingDetail}>
                <Icon name="clock-outline" size={14} color="#78909C" />
                <Text style={styles.upcomingTime}>Tomorrow, 10:30 AM</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.upcomingAction}>
              <Icon name="bell-ring-outline" size={20} color="#4C6EFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.upcomingItem}>
            <LinearGradient
              colors={['#6C63FF', '#8F89FF']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.upcomingIcon}>
              <Icon name="clipboard-text" size={20} color="#FFF" />
            </LinearGradient>
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingName}>
                Science Project Submission
              </Text>
              <View style={styles.upcomingDetail}>
                <Icon name="clock-outline" size={14} color="#78909C" />
                <Text style={styles.upcomingTime}>April 5, 2:00 PM</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.upcomingAction}>
              <Icon name="bell-ring-outline" size={20} color="#4C6EFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.upcomingItem}>
            <LinearGradient
              colors={['#4CAF50', '#66BB6A']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 1}}
              style={styles.upcomingIcon}>
              <Icon name="account-group" size={20} color="#FFF" />
            </LinearGradient>
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingName}>Parent-Teacher Meeting</Text>
              <View style={styles.upcomingDetail}>
                <Icon name="clock-outline" size={14} color="#78909C" />
                <Text style={styles.upcomingTime}>April 10, 4:30 PM</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.upcomingAction}>
              <Icon name="bell-ring-outline" size={20} color="#4C6EFF" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavContainer}>
        <TouchableOpacity style={styles.navItem}>
          <Icon name="home-variant" size={24} color="#4C6EFF" />
          <Text style={[styles.navText, {color: '#4C6EFF'}]}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="calendar-month" size={24} color="#78909C" />
          <Text style={styles.navText}>Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItemCenter}>
          <LinearGradient
            colors={['#4C6EFF', '#6C8FFF']}
            style={styles.navCenterButton}>
            <Icon name="plus" size={26} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="chart-line" size={24} color="#78909C" />
          <Text style={styles.navText}>Progress</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <Icon name="account" size={24} color="#78909C" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F8FD',
  },
  headerGradient: {
    marginBottom: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  userInfoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImageContainer: {
    height: 60,
    width: 60,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    position: 'relative',
  },
  profileImage: {
    height: 56,
    width: 56,
    borderRadius: 18,
  },
  onlineIndicator: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  textContainer: {
    marginLeft: 15,
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  studentName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 2,
  },
  schoolInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  schoolName: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 5,
    marginRight: 10,
  },
  classBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  classText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    position: 'relative',
  },
  iconBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FF5252',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  badgeText: {
    color: 'white',
    fontSize: 9,
    fontWeight: 'bold',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  attendanceBanner: {
    borderRadius: 20,
    // marginTop: -25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  attendanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  attendanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circularProgress: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  progressText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  attendanceTextContainer: {
    marginLeft: 15,
  },
  attendanceTitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  attendanceStatus: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 2,
  },
  attendanceRight: {
    alignItems: 'flex-end',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  dateText: {
    color: 'white',
    marginLeft: 5,
    fontSize: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#263238',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#4C6EFF',
    fontSize: 13,
    fontWeight: '500',
    marginRight: 2,
  },
  modulesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  moduleCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    width: width * 0.42,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    alignItems: 'center',
    position: 'relative',
  },
  iconGradient: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#263238',
    textAlign: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FF5252',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  notificationText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  upcomingContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  upcomingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F4F8',
  },
  upcomingIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#263238',
    marginBottom: 5,
  },
  upcomingDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upcomingTime: {
    fontSize: 12,
    color: '#78909C',
    marginLeft: 5,
  },
  upcomingAction: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(76, 110, 255, 0.1)',
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -3},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navItemCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -30,
  },
  navCenterButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4C6EFF',
    shadowOffset: {width: 0, height: 5},
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  navText: {
    color: '#78909C',
    fontSize: 11,
    marginTop: 3,
  },
});

export default DashBoard;
