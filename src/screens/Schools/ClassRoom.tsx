import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import moment from 'moment';
import Ionics from 'react-native-vector-icons/Ionicons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useSchoolStore from '../../zustand/schoolStore';
import {useFetchSchoolClassess} from '../../queries/schoolQueries/schoolQueries';

const ClassroomScreen = ({navigation}: any) => {
  const insets = useSafeAreaInsets();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const schoolId = useSchoolStore(state => state.schoolId);
  const {data, refetch, isPending, isError} = useFetchSchoolClassess(schoolId);

  const filters = [
    'All',
    'Section A',
    'Section B',
    'Section C',
    'Section D',
    'Section E',
  ];
  const onRefresh = () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  const handleAddClass = () => {
    navigation.navigate('AddClassroomScreen', {schoolId});
  };

  const filteredClassrooms =
    selectedFilter === 'All'
      ? data?.classes
      : data?.classes.filter(
          classroom => `Section ${classroom.section}` === selectedFilter,
        );

  const renderClassroomCard = ({item}) => {
    const formattedDate = moment(item.createdAt).format('DD MMM YYYY');

    return (
      <TouchableOpacity style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.classDetails}>
            <Text style={styles.className}>{item.name}</Text>
            <View style={styles.sectionBadge}>
              <Text style={styles.sectionText}>Section {item.section}</Text>
            </View>
          </View>
          <View style={styles.strengthContainer}>
            <Text style={styles.strengthValue}>{item.strength}</Text>
            <Text style={styles.strengthLabel}>Students</Text>
          </View>
        </View>

        <View style={styles.divider} />
        <View style={styles.cardFooter}>
          <View style={styles.teacherContainer}>
            <Image
              source={{uri: 'https://via.placeholder.com/40'}}
              style={styles.teacherImage}
            />
            <View>
              <Text style={styles.teacherTitle}>Class Teacher</Text>
              <Text style={styles.teacherName}>{item.classTeacher}</Text>
            </View>
          </View>
          <Text style={styles.dateText}>Created on {formattedDate}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (isPending && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6da7" />
        <Text style={styles.loadingText}>Loading clasess...</Text>
      </SafeAreaView>
    );
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <View style={{...styles.header, paddingTop: insets.top}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionics name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Classes</Text>
            <Text style={styles.subtitle}>Manage your school classrooms</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddClass}>
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filters}
          keyExtractor={item => item}
          renderItem={({item}) => (
            <TouchableOpacity
              style={[
                styles.filterButton,
                selectedFilter === item && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(item)}>
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === item && styles.filterTextActive,
                ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.filterList}
        />
      </View>

      <FlatList
        data={filteredClassrooms}
        keyExtractor={item => item._id}
        renderItem={renderClassroomCard}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#4a6da7']}
            tintColor="#4a6da7"
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
  },
  filterContainer: {
    paddingVertical: 15,
  },
  filterList: {
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    marginRight: 10,
  },
  filterButtonActive: {
    backgroundColor: '#4361ee',
  },
  filterText: {
    fontSize: 14,
    color: '#495057',
  },
  filterTextActive: {
    color: '#ffffff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  classDetails: {
    flex: 1,
  },
  className: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  sectionBadge: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  sectionText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '600',
  },
  strengthContainer: {
    backgroundColor: '#f1f8ff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  strengthValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4361ee',
  },
  strengthLabel: {
    fontSize: 12,
    color: '#4361ee',
    opacity: 0.8,
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teacherContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teacherImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  teacherTitle: {
    fontSize: 12,
    color: '#6c757d',
  },
  teacherName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  dateText: {
    fontSize: 12,
    color: '#6c757d',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4361ee',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#4361ee',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  fabText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
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
});

export default ClassroomScreen;
