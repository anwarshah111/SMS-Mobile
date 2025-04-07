import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
} from 'react-native';
import useFetchStudents, {
  useUpdateStudentRequestMutate,
} from '../../queries/schoolQueries/schoolQueries';

export default function RequestedStudents() {
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const {data, status, refetch} = useFetchStudents('67ef846493e4b723d8b725d5');
  const {mutate} = useUpdateStudentRequestMutate();

  const handleAccept = (studentId: string) => {
    mutate({studentID: studentId, status: 'A'});
    console.log(`Student ${studentId} accepted`);
    // Add your logic here to handle acceptance
  };

  const handleReject = (studentId: string) => {
    mutate({studentID: studentId, status: 'R'});
    console.log(`Student ${studentId} rejected`);
    // Add your logic here to handle rejection
  };

  const handleRefresh = () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  const StudentCard = ({student}: {student: any}) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Image
          source={{uri: student.photo}}
          style={styles.avatar}
          // defaultSource={require('./placeholder.png')}
        />

        <View style={styles.studentDetails}>
          <Text style={styles.name}>{student.studentName}</Text>

          <View style={styles.infoContainer}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Age</Text>
              <Text style={styles.infoValue}>{student.age}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Grade</Text>
              <Text style={styles.infoValue}>{student.grade}</Text>
            </View>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Applied</Text>
              <Text style={styles.infoValue}>{student.appliedAt}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => handleReject(student._id)}>
          <Text style={styles.rejectButtonText}>Decline</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.acceptButton}
          onPress={() => handleAccept(student._id)}>
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Text style={styles.titleSmall}>School Admissions</Text>
        <Text style={styles.title}>Pending Applications</Text>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search students..."
            placeholderTextColor="#FFF"
            value={searchText}
            onChangeText={setSearchText}
          />
          <View style={styles.searchIconContainer}>
            <Text style={styles.searchIcon}>🔍</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={data}
        renderItem={({item}) => <StudentCard student={item} />}
        keyExtractor={item => item._id}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No pending applications</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  header: {
    padding: 20,
    backgroundColor: '#246EE9',
    paddingTop: 60,
    paddingBottom: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  titleSmall: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  searchContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  searchInput: {
    height: 40,
    paddingHorizontal: 12,
    flex: 1,
    color: 'white',
  },
  searchIconContainer: {
    padding: 8,
  },
  searchIcon: {
    fontSize: 16,
    color: 'white',
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detailLabel: {
    fontWeight: '500',
    color: '#555',
  },
  cardArrow: {
    justifyContent: 'center',
    padding: 8,
  },
  arrowText: {
    fontSize: 24,
    color: '#BBB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
    padding: 24,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#555',
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 10,
  },
  headerTextContainer: {
    flex: 1,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  modalName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },
  applicationTag: {
    backgroundColor: '#FFF0C2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  applicationTagText: {
    color: '#B78105',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsList: {
    flex: 1,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#246EE9',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailModalLabel: {
    width: 80,
    fontWeight: '500',
    color: '#555',
    fontSize: 15,
  },
  detailValue: {
    flex: 1,
    color: '#333',
    fontSize: 15,
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activityTag: {
    backgroundColor: '#E8F0FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  activityText: {
    color: '#246EE9',
    fontWeight: '500',
  },
  personalStatement: {
    color: '#333',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },

  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  studentDetails: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  infoItem: {
    marginRight: 16,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#71717a',
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#3f3f46',
    fontWeight: '500',
  },
  actionContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: 'hidden',
    borderTopColor: '#f1f1f4',
  },
  acceptButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rejectButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#f1f1f4',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  rejectButtonText: {
    color: '#6b7280',
    fontWeight: '600',
    fontSize: 16,
  },
});
