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
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import useFetchStudents, {
  useFetchApprovedStudents,
  useRemoveStudentsMutation,
  useUpdateStudentRequestMutate,
} from '../../queries/schoolQueries/schoolQueries';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function ManageStudents() {
  const [searchText, setSearchText] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  const {data, refetch} = useFetchApprovedStudents('67ef846493e4b723d8b725d5');

  const {mutate} = useRemoveStudentsMutation();

  const handleRefresh = () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  const handleRemove = id => {
    mutate({id});
    setMenuOpenId(null);
  };

  const filteredData = data?.filter(student =>
    student.studentName.toLowerCase().includes(searchText.toLowerCase()),
  );

  const StudentCard = ({student}) => {
    const initial = student.studentName.charAt(0).toUpperCase();

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => setSelectedStudent(student)}
        activeOpacity={0.9}>
        {student.profile ? (
          <Image source={{uri: student.profile}} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <Text style={styles.avatarInitial}>{initial}</Text>
          </View>
        )}

        <View style={styles.info}>
          <Text style={styles.name}>{student.studentName}</Text>
          <View style={styles.tagRow}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Grade {student.grade}</Text>
            </View>
            <View style={[styles.tag, styles.ageTag]}>
              <Text style={styles.tagText}>{student.age} years</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.menuIcon}
          onPress={() =>
            setMenuOpenId(menuOpenId === student._id ? null : student._id)
          }>
          <Entypo name="dots-three-vertical" size={20} color="#5D5FEF" />
        </TouchableOpacity>

        {menuOpenId === student._id && (
          <View style={styles.menu}>
            <TouchableOpacity
              style={styles.menuOptionContainer}
              onPress={() => handleRemove(student._id)}>
              <Ionicons name="trash-outline" size={16} color="#FF4757" />
              <Text style={styles.menuItem}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  const insets = useSafeAreaInsets();
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#5D5FEF" />
        <LinearGradient colors={['#5D5FEF', '#7879F1']} style={styles.header}>
          <View
            style={{
              paddingTop: insets.top,
              paddingHorizontal: 15,
              paddingVertical: 30,
            }}>
            <Text style={styles.titleSmall}>School Admissions</Text>
            <Text style={styles.title}>Manage Students</Text>

            <View style={styles.searchContainer}>
              <Ionicons
                name="search-outline"
                size={20}
                color="#fff"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search students..."
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{data?.length || 0}</Text>
            <Text style={styles.statLabel}>Students</Text>
          </View>
          {/* <View style={[styles.statItem, styles.statItemBorder]}>
            <Text style={styles.statNumber}>
              {data?.filter(s => s.grade === '12').length || 0}
            </Text>
            <Text style={styles.statLabel}>Grade 12</Text>
          </View> */}
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {data?.filter(s => parseInt(s.age) < 10).length || 0}
            </Text>
            <Text style={styles.statLabel}>Under 10</Text>
          </View>
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={item => item._id}
          renderItem={({item}) => <StudentCard student={item} />}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="school-outline" size={60} color="#DCDCF9" />
              <Text style={styles.emptyText}>No students found</Text>
              <Text style={styles.emptySubText}>Try adjusting your search</Text>
            </View>
          }
        />

        <Modal
          visible={!!selectedStudent}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={() => setSelectedStudent(null)}>
          <TouchableWithoutFeedback onPress={() => setSelectedStudent(null)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalCard}>
                  {selectedStudent && (
                    <>
                      <View style={styles.modalImageContainer}>
                        {selectedStudent.profile ? (
                          <Image
                            source={{uri: selectedStudent.profile}}
                            style={styles.modalImage}
                          />
                        ) : (
                          <View style={styles.modalAvatarFallback}>
                            <Text style={styles.modalAvatarInitial}>
                              {selectedStudent.studentName
                                .charAt(0)
                                .toUpperCase()}
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.modalTitle}>
                        {selectedStudent.studentName}
                      </Text>

                      <View style={styles.modalInfoRow}>
                        <View style={styles.modalInfoItem}>
                          <Ionicons
                            name="school-outline"
                            size={20}
                            color="#5D5FEF"
                          />
                          <Text style={styles.modalText}>
                            Grade {selectedStudent.grade}
                          </Text>
                        </View>

                        <View style={styles.modalInfoItem}>
                          <Ionicons
                            name="calendar-outline"
                            size={20}
                            color="#5D5FEF"
                          />
                          <Text style={styles.modalText}>
                            {selectedStudent.age} years old
                          </Text>
                        </View>
                      </View>

                      <Pressable
                        onPress={() => setSelectedStudent(null)}
                        style={({pressed}) => [
                          styles.closeButton,
                          pressed && styles.closeButtonPressed,
                        ]}>
                        <Text style={styles.closeText}>Close</Text>
                      </Pressable>
                    </>
                  )}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7FF',
  },
  header: {
    // paddingTop: 60,
    paddingBottom: 30,
    // paddingHorizontal: 24,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  titleSmall: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginBottom: 4,
    fontWeight: '500',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  searchContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    fontSize: 16,
    color: 'white',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginTop: -25,
    marginBottom: 10,
    shadowColor: '#5D5FEF',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#EFEFFF',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#5D5FEF',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#5D5FEF',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: {width: 0, height: 2},
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#F0F0FF',
  },
  avatarFallback: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    backgroundColor: '#DCDCF9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D5FEF',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  tagRow: {
    flexDirection: 'row',
  },
  tag: {
    backgroundColor: '#F0F0FF',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginRight: 8,
  },
  ageTag: {
    backgroundColor: '#FFF0F0',
  },
  tagText: {
    fontSize: 12,
    color: '#5D5FEF',
    fontWeight: '500',
  },
  menuIcon: {
    padding: 8,
  },
  menu: {
    position: 'absolute',
    top: 50,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 5},
    elevation: 5,
    zIndex: 99,
  },
  menuOptionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  menuItem: {
    fontSize: 14,
    color: '#FF4757',
    fontWeight: '500',
    marginLeft: 8,
  },
  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#5D5FEF',
    fontWeight: '600',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(93, 95, 239, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '85%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#5D5FEF',
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  modalImageContainer: {
    padding: 4,
    backgroundColor: '#F7F7FF',
    borderRadius: 50,
    marginBottom: 20,
  },
  modalImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#5D5FEF',
  },
  modalAvatarFallback: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#DCDCF9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#5D5FEF',
  },
  modalAvatarInitial: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#5D5FEF',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 16,
  },
  modalInfoRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
  },
  modalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginLeft: 8,
    fontWeight: '500',
  },
  closeButton: {
    marginTop: 8,
    backgroundColor: '#5D5FEF',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 16,
  },
  closeButtonPressed: {
    backgroundColor: '#4748BE',
  },
  closeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
