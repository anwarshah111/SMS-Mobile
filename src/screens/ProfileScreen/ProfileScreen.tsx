import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const {width} = Dimensions.get('window');

const ProfileScreen = ({navigation}: any) => {
  // Sample user data
  const user = {
    name: 'Alex Johnson',
    role: 'Product Designer',
    bio: 'Creating beautiful digital experiences | Minimalist | Coffee enthusiast',
    location: 'San Francisco, CA',
    followers: '8.5K',
    following: '384',
    profileImage: 'https://via.placeholder.com/150',
  };

  // Sample activity data
  const activityData = [
    {id: 1, type: 'Project', title: 'Mobile App Redesign', date: '2 days ago'},
    {id: 2, type: 'Design', title: 'Dashboard UI Kit', date: '1 week ago'},
    {
      id: 3,
      type: 'Collaboration',
      title: 'Team Workspace',
      date: '2 weeks ago',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Image
            source={{uri: user.profileImage}}
            style={styles.profileImage}
          />

          <View style={styles.nameContainer}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.role}>{user.role}</Text>
          </View>

          <Text style={styles.bio}>{user.bio}</Text>

          <View style={styles.locationContainer}>
            <Icon name="map-pin" size={16} color="#666" />
            <Text style={styles.locationText}>{user.location}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('DashBoard')}>
            <Text style={styles.statValue}>{user.followers}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity
            style={styles.statItem}
            onPress={() => navigation.navigate('SchoolRegistration')}>
            <Text style={styles.statValue}>{user.following}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.navigate('Test')}>
            <Text style={styles.primaryButtonText}>Query Testing</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => navigation.navigate('TestPhotos')}>
            <Icon name="share-2" size={20} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          {activityData.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.activityItem}
              onPress={() => navigation.navigate('SchoolRequestScreen')}>
              <View style={styles.activityIcon}>
                <Icon
                  name={
                    item.type === 'Project'
                      ? 'briefcase'
                      : item.type === 'Design'
                      ? 'pen-tool'
                      : 'users'
                  }
                  size={18}
                  color="#fff"
                />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityType}>{item.type}</Text>
                <Text style={styles.activityTitle}>{item.title}</Text>
                <Text style={styles.activityDate}>{item.date}</Text>
              </View>
              <Icon name="chevron-right" size={20} color="#999" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Portfolio Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Portfolio</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SchoolsDashboard')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.portfolioScroll}>
            {[1, 2, 3, 4].map(item => (
              <View key={item} style={styles.portfolioItem}>
                <Image
                  source={{
                    uri: `https://via.placeholder.com/300/${Math.floor(
                      Math.random() * 16777215,
                    ).toString(16)}`,
                  }}
                  style={styles.portfolioImage}
                />
                <Text style={styles.portfolioTitle}>Project {item}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Contact Section */}
        <View style={styles.contactContainer}>
          <TouchableOpacity style={styles.contactItem}>
            <Icon name="mail" size={22} color="#333" />
            <Text style={styles.contactText}>Message</Text>
          </TouchableOpacity>
          <View style={styles.contactDivider} />
          <TouchableOpacity style={styles.contactItem}>
            <Icon name="phone" size={22} color="#333" />
            <Text style={styles.contactText}>Call</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacing */}
        <View style={{height: 40}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  profileImage: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#f0f0f0',
  },
  nameContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  role: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  bio: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#777',
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    marginVertical: 10,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#777',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#eee',
    height: 30,
  },
  actionContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    backgroundColor: '#ffffff',
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityType: {
    fontSize: 12,
    color: '#777',
    marginBottom: 3,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 3,
  },
  activityDate: {
    fontSize: 12,
    color: '#999',
  },
  portfolioScroll: {
    marginTop: 5,
  },
  portfolioItem: {
    width: width * 0.35,
    marginRight: 15,
  },
  portfolioImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 8,
  },
  portfolioTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  contactContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    marginTop: 10,
  },
  contactItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  contactDivider: {
    width: 1,
    height: 25,
    backgroundColor: '#eee',
  },
});

export default ProfileScreen;
