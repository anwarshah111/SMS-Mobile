// TeachersScreen.js
import React, {useState, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionics from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {LinearGradient} from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useFetchSchoolTeachers} from '../../queries/schoolQueries/schoolQueries';
import useSchoolStore from '../../zustand/schoolStore';

const TeachersScreen = () => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();
  const schoolId = useSchoolStore(state => state.schoolId);
  const {data, refetch, isPending, isError} = useFetchSchoolTeachers(schoolId);

  const onRefresh = () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  const handleAddTeacher = () => {
    navigation.navigate('AddTeachersScreen', {schoolId});
  };

  const getInitials = name => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const getRandomColor = id => {
    const colors = [
      ['#FF9A8B', '#FF6A88'],
      ['#FCCF31', '#F55555'],
      ['#43CBFF', '#9708CC'],
      ['#5EFCE8', '#736EFE'],
      ['#FAD7A1', '#E96D71'],
      ['#56CCF2', '#2F80ED'],
    ];

    // Use the id to deterministically select a color
    const colorIndex = parseInt(id, 16) % colors.length;
    return colors[colorIndex] || colors[0];
  };

  const renderTeacherCard = ({item}) => {
    const gradientColors = getRandomColor(item.id);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => console.log('Teacher pressed:', item.id)}
        activeOpacity={0.9}>
        <View style={styles.cardContent}>
          <View style={styles.avatarContainer}>
            {item.profilePicture ? (
              <Image
                source={{uri: item.profilePicture}}
                style={styles.avatar}
              />
            ) : (
              <LinearGradient
                colors={gradientColors}
                style={styles.avatarGradient}>
                <Text style={styles.avatarText}>{getInitials(item.name)}</Text>
              </LinearGradient>
            )}
            <View
              style={[
                styles.statusIndicator,
                {backgroundColor: item.status === 'A' ? '#4CAF50' : '#F44336'},
              ]}
            />
          </View>

          <View style={styles.teacherInfo}>
            <Text style={styles.teacherName}>{item.name}</Text>
            <View style={styles.infoContainer}>
              <Icon
                name="book-open-variant"
                size={16}
                color="#666"
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{item.subject}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Icon
                name="school"
                size={16}
                color="#666"
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>{item.qualification}</Text>
            </View>
            <View style={styles.infoContainer}>
              <Icon
                name="clock-outline"
                size={16}
                color="#666"
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>
                {item.experience} years experience
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => console.log(`Call ${item.name}`)}>
            <Icon name="phone" size={14} color="#4a6da7" />
            <Text style={styles.contactButtonText}>Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => console.log(`Email ${item.name}`)}>
            <Icon name="email-outline" size={14} color="#4a6da7" />
            <Text style={styles.contactButtonText}>Email</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.moreButton}
            onPress={() => console.log(`More options for ${item.name}`)}>
            <Icon name="dots-vertical" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View style={styles.listHeader}>
      <Text style={styles.listHeaderTitle}>All Teachers</Text>
      <Text style={styles.listHeaderSubtitle}>
        {data?.teachers.length}{' '}
        {data?.teachers.length === 1 ? 'teacher' : 'teachers'} found
      </Text>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="account-group" size={80} color="#ccc" />
      <Text style={styles.emptyText}>No teachers found</Text>
      <Text style={styles.emptySubText}>
        Add your first teacher by tapping the button at the top right.
      </Text>
    </View>
  );

  if (isPending && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6da7" />
        <Text style={styles.loadingText}>Loading teachers...</Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4a6da7" />

      <View style={{...styles.header, paddingTop: insets.top}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionics name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Teachers</Text>
            <Text style={styles.subtitle}>Manage your school teachers</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddTeacher}>
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {isError ? (
        <View style={styles.errorContainer}>
          <Icon name="alert-circle-outline" size={40} color="#F44336" />
          <Text style={styles.errorText}>{isError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={data.teachers}
          renderItem={renderTeacherCard}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={ListEmptyComponent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#4a6da7']}
              tintColor="#4a6da7"
            />
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0,
    paddingBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  listHeader: {
    marginBottom: 16,
  },
  listHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  listHeaderSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 16,
  },
  avatarContainer: {
    marginRight: 16,
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e1e1e1',
  },
  avatarGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#fff',
  },
  teacherInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  teacherName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  infoIcon: {
    marginRight: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 16,
  },
  contactButtonText: {
    marginLeft: 4,
    color: '#4a6da7',
    fontWeight: '500',
  },
  moreButton: {
    marginLeft: 'auto',
    padding: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#4a6da7',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backButton: {
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
  },
});

export default TeachersScreen;
