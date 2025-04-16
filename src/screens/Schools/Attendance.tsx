import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StatusBar,
  ActivityIndicator,
  Dimensions,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  useFetchApprovedStudents,
  useFetchAttendanceExistQuery,
  useFetchSchoolClassess,
  useFetchSchoolSubjectQuery,
  useFetchSchoolTeachers,
  useFetchTeachersAttendanceExistQuery,
  useMarkStudentAttendaceMutation,
} from '../../queries/schoolQueries/schoolQueries';
import useSchoolStore from '../../zustand/schoolStore';
import {showToast} from '../../components/Toasters/CustomToasts';
import moment from 'moment';

const {width} = Dimensions.get('window');

const AttendanceScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [students, setStudents] = useState([]);
  const schoolId = useSchoolStore(state => state.schoolId);
  const classesData = useFetchSchoolClassess(schoolId);
  const subjectsData = useFetchSchoolSubjectQuery(schoolId);
  const studentsData = useFetchApprovedStudents(schoolId);
  const [activeTab, setActiveTab] = useState('students'); // 'students' or 'teachers'
  const [teachers, setTeachers] = useState([]);
  const {
    data: schoolTeachers,
    refetch: fetchSchoolTeachers,
    isPending,
    isError,
  } = useFetchSchoolTeachers(schoolId);
  const {data: attendanceExists} = useFetchAttendanceExistQuery(
    {
      schoolId: schoolId,
      subjectId: selectedSubject?._id,
      classId: selectedClass?._id,
      date: moment().format('YYYY-MM-DD'),
    },
    selectedSubject?._id ? true : false,
  );

  const {data: teachersAttendanceExists} = useFetchTeachersAttendanceExistQuery(
    {
      schoolId: schoolId,
      date: moment().format('YYYY-MM-DD'),
    },
    schoolId ? true : false,
  );

  useEffect(() => {
    if (classesData.data && subjectsData.data && studentsData.data) {
      setLoading(false);
    }
  }, [classesData.data, subjectsData.data, studentsData.data]);

  const {mutate} = useMarkStudentAttendaceMutation({
    onSuccess: () => {
      showToast('Attendance added successfully');
      navigation.goBack();
    },
    onError: error => {
      showToast(error.response.data?.message);
    },
  });

  const handleSelectClass = classItem => {
    setSelectedClass(classItem);
    setSelectedSubject(null);
    setStudents([]);
  };

  const handleSelectSubject = subject => {
    setSelectedSubject(subject);

    if (studentsData.data) {
      const filteredStudents = studentsData.data
        .filter((student: any) => student.subjects.includes(subject._id))
        .map((student: any) => ({
          studentId: student._id,
          studentName: student.studentName,
          rollNumber: student.rollNumber || '-',
          profileImage:
            student.profilePicture || 'https://example.com/default.jpg',
          status: 'present',
        }));

      setStudents(filteredStudents);
    }
  };

  const toggleAttendance = studentId => {
    setStudents(prevStudents =>
      prevStudents.map(student => {
        if (student.studentId === studentId) {
          // Cycle through the three states
          const newStatus =
            student.status === 'present'
              ? 'absent'
              : student.status === 'absent'
              ? 'leave'
              : 'present';

          return {
            ...student,
            status: newStatus,
          };
        }
        return student;
      }),
    );
  };

  const saveAttendance = () => {
    // Create the data structure to match the required format
    const attendanceData = {
      schoolId: schoolId,
      date: date,
      classId: selectedClass._id,
      className: selectedClass.name,
      subjectId: selectedSubject._id,
      subjectName: selectedSubject.name,
      students: students.map(student => ({
        studentId: student.studentId,
        name: student.studentName,
        rollNumber: student.rollNumber,
        profileImage: student.profileImage,
        status: student.status,
      })),
    };
    mutate({data: attendanceData});
    console.log('Saving attendance data:', attendanceData);
    // Alert.alert('Success', 'Attendance saved successfully!');
  };

  const markAllPresent = () => {
    if (activeTab === 'teachers') {
      setTeachers(prevTeachers =>
        prevTeachers.map(teacher => ({...teacher, status: 'present'})),
      );
    } else {
      setTeachers(prevStudents =>
        prevStudents.map(student => ({...student, status: 'present'})),
      );
    }
  };

  const markAllAbsent = () => {
    if (activeTab === 'teachers') {
      setTeachers(prevTeachers =>
        prevTeachers.map(teacher => ({...teacher, status: 'absent'})),
      );
    } else {
      setStudents(prevStudents =>
        prevStudents.map(student => ({...student, status: 'absent'})),
      );
    }
  };

  const getAttendanceStats = () => {
    if (!students.length) return {present: 0, absent: 0, leave: 0, total: 0};

    const present = students.filter(
      student => student.status === 'present',
    ).length;
    const absent = students.filter(
      student => student.status === 'absent',
    ).length;
    const leave = students.filter(student => student.status === 'leave').length;
    const total = students.length;

    return {
      present,
      absent,
      leave,
      total,
      percentage: Math.round((present / total) * 100),
    };
  };

  const renderClassItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.classCard,
        selectedClass?._id === item._id && styles.selectedClassCard,
      ]}
      onPress={() => handleSelectClass(item)}>
      <Text
        style={[
          styles.classText,
          selectedClass?._id === item._id && styles.selectedCardText,
        ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  const renderSubjectItem = ({item}) => (
    <TouchableOpacity
      style={[
        styles.subjectCard,
        selectedSubject?._id === item?._id && styles.selectedSubjectCard,
      ]}
      onPress={() => handleSelectSubject(item)}>
      <Text
        style={[
          styles.subjectText,
          selectedSubject?._id === item?._id && styles.selectedCardText,
        ]}>
        {item?.name}
      </Text>
    </TouchableOpacity>
  );

  const getStatusBadgeStyle = status => {
    if (status === 'present') return styles.presentBadge;
    if (status === 'absent') return styles.absentBadge;
    if (status === 'leave') return styles.leaveBadge;
    return styles.presentBadge; // Default to present
  };

  const getStatusIcon = status => {
    if (status === 'present') {
      return (
        <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
      );
    } else if (status === 'absent') {
      return (
        <MaterialCommunityIcons name="close-circle" size={20} color="#fff" />
      );
    } else if (status === 'leave') {
      return (
        <MaterialCommunityIcons name="calendar-clock" size={20} color="#fff" />
      );
    }
    return (
      <MaterialCommunityIcons name="check-circle" size={20} color="#fff" />
    );
  };

  const renderStudentItem = ({item}) => (
    <View style={styles.studentCardContainer}>
      <TouchableOpacity
        style={styles.studentCard}
        onPress={() => toggleAttendance(item.studentId)}>
        <View style={styles.studentInfo}>
          <View style={styles.avatarContainer}>
            <Image
              source={{uri: item.profileImage}}
              style={styles.avatar}
              // defaultSource={require('./assets/default-avatar.png')}
            />
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>{item.studentName}</Text>
            <Text style={styles.rollNumber}>Roll #{item?.rollNumber}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.statusBadge, getStatusBadgeStyle(item.status)]}
          onPress={() => toggleAttendance(item.studentId)}>
          {getStatusIcon(item.status)}
          <Text style={styles.statusText}>
            {item.status === 'absent'
              ? 'Absent'
              : item.status === 'leave'
              ? 'Leave'
              : 'Present'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5D39C1" />
        <Text style={styles.loadingText}>Loading attendance data...</Text>
      </View>
    );
  }

  const insets = useSafeAreaInsets();
  const stats = getAttendanceStats();

  const renderTeacherItem = ({item}) => (
    <View style={styles.studentCardContainer}>
      <TouchableOpacity
        style={styles.studentCard}
        onPress={() => toggleTeacherAttendance(item.teacherId)}>
        <View style={styles.studentInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{uri: item.profileImage}} style={styles.avatar} />
          </View>
          <View style={styles.studentDetails}>
            <Text style={styles.studentName}>{item.teacherName}</Text>
            <Text style={styles.rollNumber}>{item?.subject}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.statusBadge, getStatusBadgeStyle(item.status)]}
          onPress={() => toggleTeacherAttendance(item.teacherId)}>
          {getStatusIcon(item.status)}
          <Text style={styles.statusText}>
            {item.status === 'absent'
              ? 'Absent'
              : item.status === 'leave'
              ? 'Leave'
              : 'Present'}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );

  // Add toggle function for teacher attendance
  const toggleTeacherAttendance = teacherId => {
    setTeachers(prevTeachers =>
      prevTeachers.map(teacher => {
        if (teacher.teacherId === teacherId) {
          const newStatus =
            teacher.status === 'present'
              ? 'absent'
              : teacher.status === 'absent'
              ? 'leave'
              : 'present';

          return {
            ...teacher,
            status: newStatus,
          };
        }
        return teacher;
      }),
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5D39C1" />

      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + 10}]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Attendance</Text>
          <Text style={styles.headerDate}>
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
            })}
          </Text>
        </View>

        <TouchableOpacity style={styles.calendarButton}>
          <Ionicons name="calendar" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'students' && styles.activeTab]}
          onPress={() => setActiveTab('students')}>
          <MaterialCommunityIcons
            name="account-group"
            size={22}
            color={activeTab === 'students' ? '#5D39C1' : '#666'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'students' && styles.activeTabText,
            ]}>
            Students
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'teachers' && styles.activeTab]}
          onPress={() => {
            setActiveTab('teachers');
            // Load all teachers directly when switching to teachers tab
            if (schoolTeachers?.teachers) {
              const allTeachers = schoolTeachers.teachers.map(teacher => ({
                teacherId: teacher._id,
                teacherName: teacher.name,
                subject: teacher.subject || 'Teacher',
                profileImage:
                  teacher.profilePicture || 'https://example.com/default.jpg',
                status: 'present',
              }));
              setTeachers(allTeachers);
            }
          }}>
          <MaterialCommunityIcons
            name="account-tie"
            size={22}
            color={activeTab === 'teachers' ? '#5D39C1' : '#666'}
          />
          <Text
            style={[
              styles.tabText,
              activeTab === 'teachers' && styles.activeTabText,
            ]}>
            Teachers
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'students' ? (
        <View style={{flex: 1}}>
          {/* Classes Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Classes</Text>
            <FlatList
              data={classesData?.data?.classes}
              renderItem={renderClassItem}
              keyExtractor={item => item._id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalListContent}
            />
          </View>

          {/* Subjects Section */}
          {selectedClass && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Subjects</Text>
              <FlatList
                data={subjectsData.data?.subjects?.filter(item =>
                  item.classId === selectedClass._id ? item : null,
                )}
                renderItem={renderSubjectItem}
                keyExtractor={item => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalListContent}
              />
            </View>
          )}

          {/* Students Section */}
          {selectedSubject && students.length > 0 ? (
            attendanceExists && !attendanceExists?.exists ? (
              <>
                <View style={styles.attendanceStatsContainer}>
                  <View style={styles.statsCard}>
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{stats.present}</Text>
                      <Text style={styles.statLabel}>Present</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{stats.absent}</Text>
                      <Text style={styles.statLabel}>Absent</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                      <Text style={styles.statValue}>{stats.leave}</Text>
                      <Text style={styles.statLabel}>Leave</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.attendanceHeader}>
                  <Text style={styles.sectionTitle}>
                    Students ({stats.total})
                  </Text>
                  <View style={styles.markAllButtons}>
                    <TouchableOpacity
                      style={[styles.markAllButton, styles.presentButton]}
                      onPress={markAllPresent}>
                      <Text style={styles.markAllText}>All Present</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.markAllButton, styles.absentButton]}
                      onPress={markAllAbsent}>
                      <Text style={styles.markAllText}>All Absent</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.studentListContainer}>
                  <FlatList
                    data={students}
                    renderItem={renderStudentItem}
                    keyExtractor={item => item.studentId}
                    contentContainerStyle={styles.studentListContent}
                  />
                </View>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={saveAttendance}
                  activeOpacity={0.8}>
                  <Text style={styles.saveButtonText}>Save Attendance</Text>
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.noStudentsContainer}>
                <MaterialCommunityIcons
                  name="account-check-outline"
                  size={60}
                  color="#CCCCCC"
                />
                <Text style={styles.noStudentsText}>
                  Attendance already taken
                </Text>
              </View>
            )
          ) : selectedSubject ? (
            <View style={styles.noStudentsContainer}>
              <MaterialCommunityIcons
                name="account-search"
                size={60}
                color="#CCCCCC"
              />
              <Text style={styles.noStudentsText}>
                No students found for this subject
              </Text>
            </View>
          ) : null}
        </View>
      ) : teachersAttendanceExists.exists ? (
        <View style={styles.noStudentsContainer}>
          <MaterialCommunityIcons
            name="account-check-outline"
            size={60}
            color="#CCCCCC"
          />
          <Text style={styles.noStudentsText}>Attendance already Filled</Text>
        </View>
      ) : (
        <View style={{flex: 1}}>
          <View style={styles.attendanceStatsContainer}>
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {teachers.filter(t => t.status === 'present').length}
                </Text>
                <Text style={styles.statLabel}>Present</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {teachers.filter(t => t.status === 'absent').length}
                </Text>
                <Text style={styles.statLabel}>Absent</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>
                  {teachers.filter(t => t.status === 'leave').length}
                </Text>
                <Text style={styles.statLabel}>Leave</Text>
              </View>
            </View>
          </View>
          <View style={styles.attendanceHeader}>
            <Text style={styles.sectionTitle}>
              {'Teachers'} ({teachers.length})
            </Text>
            <View style={styles.markAllButtons}>
              <TouchableOpacity
                style={[styles.markAllButton, styles.presentButton]}
                onPress={markAllPresent}>
                <Text style={styles.markAllText}>All Present</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.markAllButton, styles.absentButton]}
                onPress={markAllAbsent}>
                <Text style={styles.markAllText}>All Absent</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.studentListContainer}>
            <FlatList
              data={teachers}
              renderItem={renderTeacherItem}
              keyExtractor={item => item._id}
              contentContainerStyle={styles.studentListContent}
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveAttendance}
            activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>
              Save {'Teacher'} Attendance
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FD',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#5D39C1',
    fontWeight: '500',
  },
  header: {
    backgroundColor: '#5D39C1',
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    marginTop: 10,
    paddingHorizontal: 10,
  },
  horizontalListContent: {
    paddingRight: 20,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  classCard: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEF0F7',
  },
  selectedClassCard: {
    backgroundColor: '#5D39C1',
    borderColor: '#5D39C1',
  },
  classText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#484848',
  },
  subjectCard: {
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#EEF0F7',
  },
  selectedSubjectCard: {
    backgroundColor: '#5D39C1',
    borderColor: '#5D39C1',
  },
  subjectText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#484848',
  },
  selectedCardText: {
    color: 'white',
  },
  attendanceStatsContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  statsCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#EEF0F7',
    height: '80%',
    alignSelf: 'center',
  },
  attendanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 24,
  },
  markAllButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  markAllButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    marginLeft: 6,
  },
  markAllText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  presentButton: {
    backgroundColor: '#32A854',
  },
  absentButton: {
    backgroundColor: '#F24040',
  },
  leaveButton: {
    backgroundColor: '#FF9800',
  },
  studentListContainer: {
    flex: 1,
    marginTop: 12,
    paddingHorizontal: 20,
  },
  studentListContent: {
    paddingBottom: 20,
  },
  studentCardContainer: {
    marginVertical: 6,
  },
  studentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: '#EEF0F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#EEF0F7',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 25,
  },
  studentDetails: {
    marginLeft: 14,
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  rollNumber: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  presentBadge: {
    backgroundColor: '#32A854',
  },
  absentBadge: {
    backgroundColor: '#F24040',
  },
  leaveBadge: {
    backgroundColor: '#FF9800',
  },
  statusText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 6,
  },
  saveButton: {
    backgroundColor: '#5D39C1',
    marginHorizontal: 20,
    marginBottom: 24,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noStudentsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  noStudentsText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    marginTop: 16,
    marginBottom: 4,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  activeTab: {
    backgroundColor: '#F0EBFA',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#5D39C1',
  },
});

export default AttendanceScreen;
