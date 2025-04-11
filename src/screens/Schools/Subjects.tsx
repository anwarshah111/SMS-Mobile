import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Image,
  ActivityIndicator,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useFetchSchoolClassess,
  useFetchSchoolSubjectQuery,
} from '../../queries/schoolQueries/schoolQueries';
import useSchoolStore from '../../zustand/schoolStore';

const getSubjectIcon = subjectName => {
  const subjectColors = {
    Science: '#4CAF50', // Green
    Mathematics: '#2196F3', // Blue
    'English Literature': '#9C27B0', // Purple
    'Computer Science': '#FF9800', // Orange
    History: '#795548', // Brown
  };

  return subjectColors[subjectName] || '#607D8B';
};

const SubjectsScreen = ({navigation}: any) => {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('all');
  const schoolId = useSchoolStore(state => state.schoolId);
  const classData = useFetchSchoolClassess(schoolId);
  const {data, refetch, isPending} = useFetchSchoolSubjectQuery(schoolId);

  const handleAddSubject = () => {
    navigation.navigate('AddSubjectsScreen', {schoolId});
  };

  const filteredSubjects = () => {
    if (filter === 'all') return data?.subjects;
    return data?.subjects.filter(subject => subject.className === filter);
  };

  const renderSubjectCard = ({item}) => {
    const subjectColor = getSubjectIcon(item.name);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('SubjectDetail', {subject: item})}>
        <View style={styles.cardContent}>
          <View
            style={[
              styles.subjectIconContainer,
              {backgroundColor: subjectColor},
            ]}>
            <Text style={styles.subjectIconText}>{item.name.charAt(0)}</Text>
          </View>

          <View style={styles.subjectInfo}>
            <View style={styles.subjectHeader}>
              <Text style={styles.subjectName}>{item.name}</Text>
              {item.isElective && (
                <View style={styles.electiveBadge}>
                  <Text style={styles.electiveText}>Elective</Text>
                </View>
              )}
            </View>

            <Text style={styles.subjectCode}>{item.code}</Text>
            <Text style={styles.teacherName}>Teacher: {item.teacher}</Text>
            <Text style={styles.className}>Class: {item.className}</Text>

            <View style={styles.scheduleRow}>
              <View style={styles.scheduleItem}>
                <Ionicons name="calendar-outline" size={14} color="#666" />
                {item.schedule.days?.length ? (
                  item.schedule.days?.map(day => (
                    <Text style={styles.scheduleText} key={day}>
                      {day.slice(0, 3)}
                    </Text>
                  ))
                ) : (
                  <Text style={styles.scheduleText}>{'All'}</Text>
                )}
              </View>
              <View style={styles.scheduleItem}>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text style={styles.scheduleText}>
                  {item.schedule.startTime} - {item.schedule.endTime}
                </Text>
              </View>
            </View>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#bbb"
            style={styles.arrow}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const renderClassFilter = () => {
    return (
      <View style={styles.filtersContainer}>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
          onPress={() => setFilter('all')}>
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.activeFilterText,
            ]}>
            All Classes
          </Text>
        </TouchableOpacity>

        {classData?.data?.classes?.map(singleClass => (
          <TouchableOpacity
            key={singleClass?._id}
            style={[
              styles.filterButton,
              filter === singleClass?.name && styles.activeFilter,
            ]}
            onPress={() => setFilter(singleClass?.name)}>
            <Text
              style={[
                styles.filterText,
                filter === singleClass?.name && styles.activeFilterText,
              ]}>
              {singleClass?.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      <View style={{...styles.header, paddingTop: insets.top}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>Subjects</Text>
            <Text style={styles.subtitle}>Manage your school subjects</Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleAddSubject}>
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {renderClassFilter()}

      {isPending ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
          <Text style={styles.loadingText}>Loading subjects...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={filteredSubjects()}
            renderItem={renderSubjectCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="book-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No subjects found</Text>
                <Text style={styles.emptySubText}>
                  Try changing your filter or add a new subject
                </Text>
              </View>
            }
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Total: {filteredSubjects().length} subject
              {filteredSubjects().length !== 1 ? 's' : ''}
            </Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 2,
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
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexWrap: 'wrap',
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: '#4F46E5',
  },
  filterText: {
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 70, // Extra space for footer
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  subjectIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  subjectIconText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subjectInfo: {
    flex: 1,
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  subjectName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  electiveBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    marginLeft: 8,
  },
  electiveText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  subjectCode: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  teacherName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  className: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    fontWeight: '500',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  scheduleText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  arrow: {
    marginLeft: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    padding: 40,
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
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
});

export default SubjectsScreen;
