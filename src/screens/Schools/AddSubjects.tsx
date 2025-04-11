import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  TextInput,
  SafeAreaView,
  Modal,
  FlatList,
  Image,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  useAddSchoolSubjectsMutation,
  useFetchSchoolClassess,
  useFetchSchoolTeachers,
} from '../../queries/schoolQueries/schoolQueries';
import {useRoute} from '@react-navigation/native';
import {showToast} from '../../components/Toasters/CustomToasts';

const AddSubjectsScreen = ({navigation}: any) => {
  const routes = useRoute();
  const schoolId = routes.params?.schoolId;
  const insets = useSafeAreaInsets();

  const classDetails = useFetchSchoolClassess(schoolId);
  const teachersDetails = useFetchSchoolTeachers(schoolId);

  const [subjectData, setSubjectData] = useState({
    name: '',
    code: '',
    schoolId: schoolId,
    teacher: '',
    teacherId: '',
    description: '',
    className: '',
    classId: '',
    maxMarks: 100,
    passMarks: 33,
    isElective: false,
    schedule: {
      days: ['All'],
      startTime: '10:00',
      endTime: '11:00',
    },
  });
  const {mutate} = useAddSchoolSubjectsMutation({
    onSuccess: () => {
      showToast('Subject added successfully');
      navigation.goBack();
    },
    onError: error => {
      showToast(error.response.data?.message);
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);

  const days = [
    'All',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setSubjectData({
        ...subjectData,
        [parent]: {
          ...subjectData[parent],
          [child]: value,
        },
      });
    } else {
      setSubjectData({
        ...subjectData,
        [field]: value,
      });
    }
  };

  const handleDayToggle = day => {
    let updatedDays;

    if (day === 'All') {
      updatedDays = ['All'];
    } else {
      updatedDays = [...subjectData.schedule.days];
      if (updatedDays.includes('All')) {
        updatedDays = updatedDays.filter(d => d !== 'All');
      }
      if (updatedDays.includes(day)) {
        updatedDays = updatedDays.filter(d => d !== day);
        if (updatedDays.length === 0) {
          updatedDays = ['All'];
        }
      } else {
        updatedDays.push(day);
      }
    }

    setSubjectData({
      ...subjectData,
      schedule: {
        ...subjectData.schedule,
        days: updatedDays,
      },
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!subjectData.name) newErrors.name = 'Subject name is required';
    if (!subjectData.code) newErrors.code = 'Subject code is required';
    if (!subjectData.teacher) newErrors.teacher = 'Teacher name is required';
    if (!subjectData.className) newErrors.className = 'Class is required';
    if (!subjectData.schedule.startTime)
      newErrors['schedule.startTime'] = 'Start time is required';
    if (!subjectData.schedule.endTime)
      newErrors['schedule.endTime'] = 'End time is required';
    if (subjectData.schedule.days.length === 0)
      newErrors['schedule.days'] = 'At least one day must be selected';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      console.log('Submitting data:', subjectData);
      mutate({data: subjectData});
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectTeacher = teacher => {
    setSubjectData({
      ...subjectData,
      teacher: teacher.name,
      teacherId: teacher._id,
    });
    setShowTeacherModal(false);
    setErrors(prev => ({...prev, teacher: ''}));
  };

  const handleSelectClass = classItem => {
    setSubjectData({
      ...subjectData,
      className: classItem.name,
      classId: classItem._id,
    });
    setShowClassModal(false);
    setErrors(prev => ({...prev, className: ''}));
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />
      <View style={{...styles.header, paddingTop: insets.top}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Subject</Text>
      </View>

      <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Subject Name</Text>
            <TextInput
              style={styles.input}
              value={subjectData.name}
              onFocus={() => setErrors(prev => ({...prev, name: ''}))}
              onChangeText={text => handleInputChange('name', text)}
              placeholder="Enter subject name"
              placeholderTextColor="#aaa"
            />
            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Subject Code</Text>
            <TextInput
              style={styles.input}
              value={subjectData.code}
              onFocus={() => setErrors(prev => ({...prev, code: ''}))}
              onChangeText={text => handleInputChange('code', text)}
              placeholder="Enter subject code"
              placeholderTextColor="#aaa"
            />
            {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={subjectData.description}
              onChangeText={text => handleInputChange('description', text)}
              placeholder="Enter subject description"
              placeholderTextColor="#aaa"
              multiline={true}
              numberOfLines={4}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Teacher & Class</Text>
          <View style={{marginBottom: 15}}>
            <TouchableOpacity
              style={styles.dropdownSelector}
              onPress={() => {
                setShowTeacherModal(true);
              }}>
              <View style={styles.dropdownContent}>
                <Text style={styles.label}>Teacher</Text>
                <Text style={styles.dropdownValue}>{subjectData.teacher}</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#6200ee" />
            </TouchableOpacity>
            {errors.teacher && (
              <Text style={styles.errorText}>{errors.teacher}</Text>
            )}
          </View>
          <View style={{marginBottom: 15}}>
            <TouchableOpacity
              style={styles.dropdownSelector}
              onPress={() => {
                setShowClassModal(true);
              }}>
              <View style={styles.dropdownContent}>
                <Text style={styles.label}>Class</Text>
                <Text style={styles.dropdownValue}>
                  {subjectData.className}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#6200ee" />
            </TouchableOpacity>
            {errors.className && (
              <Text style={styles.errorText}>{errors.className}</Text>
            )}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Grading Information</Text>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Maximum Marks</Text>
              <TextInput
                style={styles.input}
                value={String(subjectData.maxMarks)}
                onChangeText={text =>
                  handleInputChange('maxMarks', parseInt(text) || 0)
                }
                keyboardType="numeric"
                placeholder="100"
                placeholderTextColor="#aaa"
              />
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Pass Marks</Text>
              <TextInput
                style={styles.input}
                value={String(subjectData.passMarks)}
                onChangeText={text =>
                  handleInputChange('passMarks', parseInt(text) || 0)
                }
                keyboardType="numeric"
                placeholder="35"
                placeholderTextColor="#aaa"
              />
            </View>
          </View>

          <View style={styles.switchContainer}>
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Elective Subject</Text>
              <Switch
                value={subjectData.isElective}
                onValueChange={value => handleInputChange('isElective', value)}
                trackColor={{false: '#d1d1d1', true: '#4F46E5'}}
                thumbColor={subjectData.isElective ? '#fff' : '#f4f3f4'}
                ios_backgroundColor="#d1d1d1"
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Schedule</Text>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Days (Select multiple)</Text>
            <View style={styles.dayPicker}>
              {days.map(day => (
                <TouchableOpacity
                  key={day}
                  style={[
                    styles.dayButton,
                    subjectData.schedule.days.includes(day) &&
                      styles.selectedDayButton,
                  ]}
                  onPress={() => handleDayToggle(day)}>
                  <Text
                    style={[
                      styles.dayButtonText,
                      subjectData.schedule.days.includes(day) &&
                        styles.selectedDayButtonText,
                    ]}>
                    {day === 'All' ? 'All' : day.substring(0, 3)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors['schedule.days'] && (
              <Text style={styles.errorText}>{errors['schedule.days']}</Text>
            )}
          </View>

          <View style={styles.row}>
            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>Start Time</Text>
              <TextInput
                style={styles.input}
                value={subjectData.schedule.startTime}
                onChangeText={text =>
                  handleInputChange('schedule.startTime', text)
                }
                placeholder="10:00"
                placeholderTextColor="#aaa"
              />
              {errors['schedule.startTime'] && (
                <Text style={styles.errorText}>
                  {errors['schedule.startTime']}
                </Text>
              )}
            </View>

            <View style={[styles.formGroup, styles.halfWidth]}>
              <Text style={styles.label}>End Time</Text>
              <TextInput
                style={styles.input}
                value={subjectData.schedule.endTime}
                onChangeText={text =>
                  handleInputChange('schedule.endTime', text)
                }
                placeholder="11:00"
                placeholderTextColor="#aaa"
              />
              {errors['schedule.endTime'] && (
                <Text style={styles.errorText}>
                  {errors['schedule.endTime']}
                </Text>
              )}
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isSubmitting && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isSubmitting}>
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Adding Subject...' : 'Add Subject'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showTeacherModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowTeacherModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Teacher</Text>
              <TouchableOpacity onPress={() => setShowTeacherModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={teachersDetails?.data?.teachers}
              keyExtractor={item => item._id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectTeacher(item)}>
                  <View style={styles.teacherIconContainer}>
                    <Text style={styles.teacherIconText}>
                      {item.name.charAt(0)}
                    </Text>
                  </View>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  {subjectData.teacherId === item._id && (
                    <Ionicons name="checkmark" size={22} color="#4F46E5" />
                  )}
                </TouchableOpacity>
              )}
              style={styles.modalList}
            />
          </View>
        </View>
      </Modal>

      <Modal
        visible={showClassModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowClassModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Class</Text>
              <TouchableOpacity onPress={() => setShowClassModal(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={classDetails?.data?.classes}
              keyExtractor={item => item._id}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectClass(item)}>
                  <View
                    style={[
                      styles.classIconContainer,
                      {backgroundColor: '#4F46E5'},
                    ]}>
                    <Text style={styles.classIconText}>
                      {item.name.replace('Class ', '')}
                    </Text>
                  </View>
                  <Text style={styles.modalItemText}>{item.name}</Text>
                  {subjectData.classId === item._id && (
                    <Ionicons name="checkmark" size={22} color="#4F46E5" />
                  )}
                </TouchableOpacity>
              )}
              style={styles.modalList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  header: {
    backgroundColor: '#4F46E5',
    padding: 16,
    justifyContent: 'flex-end',
    elevation: 0,
    shadowOpacity: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginBottom: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  placeholder: {
    width: 40,
  },
  form: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#666',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#eee',
    color: '#333',
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#e53935',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  halfWidth: {
    width: '48%',
  },
  switchContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  dayPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  selectedDayButton: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  dayButtonText: {
    color: '#555',
    fontWeight: '500',
    fontSize: 14,
  },
  selectedDayButtonText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
    shadowColor: '#4F46E5',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#a5a5e0',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  dropdownContent: {
    flex: 1,
  },
  dropdownValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalList: {
    paddingHorizontal: 16,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  teacherIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  teacherIconText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  classIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  classIconText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default AddSubjectsScreen;
