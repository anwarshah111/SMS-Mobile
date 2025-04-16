import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Modal,
  FlatList,
  Image,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {LinearGradient} from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import ImagePickerModal from '../../components/ImagePickers/ImagePicker';
import CustomDatePickerModal from '../../components/DateTimePicker/DateTimePicker';
import {calculateAge, formatDateToReadable} from '../../utility/utility';
import {
  useFetchSchoolDetailsForRegistration,
  useRegisterStudentsMutation,
} from '../../queries/studentQueries/studentQueries';
import {showToast} from '../../components/Toasters/CustomToasts';
import Ionicons from 'react-native-vector-icons/Ionicons';

const StudentsRegistration = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [showClassModal, setShowClassModal] = useState(false);
  const [showSubjectsModal, setShowSubjectsModal] = useState(false);
  const [photo, setPhoto] = useState(null);
  const [schoolId, setSchoolId] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [schoolDetails, setSchoolDetails] = useState({});

  const {mutate} = useRegisterStudentsMutation({
    onSuccess: () => {
      navigation.goBack();
      showToast('Request sent to school admin!');
    },
    onError: error => {
      if (error.response.data.code === 'DUP_MOB') {
        showToast('Student with this mobile number already exists!');
      } else if (error.response.data.code === 'INVALID_SCHOOL_ID') {
        showToast('Invalid School ID!');
      } else {
        console.log('error', error.response.data?.message);
        showToast(error.response.data?.message);
      }
    },
  });

  useEffect(() => {
    if (selectedClass && schoolDetails?.school?.subjects) {
      // Filter subjects that belong to the selected class
      const classSubjects = schoolDetails.school.subjects.filter(
        subject => subject.classId === selectedClass._id,
      );
      setAvailableSubjects(classSubjects);

      // Auto-select non-elective subjects
      const nonElectiveSubjects = classSubjects.filter(
        subject => !subject.isElective,
      );
      setSelectedSubjects(nonElectiveSubjects);
    } else {
      setAvailableSubjects([]);
      setSelectedSubjects([]);
    }
  }, [selectedClass, schoolDetails]);

  const initialValues = {
    name: '',
    contact: '',
    email: '',
    grade: '',
    schoolId: '',
    dob: '',
    class: '',
    classId: '',
    subjects: [],
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Student name is required'),
    contact: Yup.string()
      .matches(/^\d{10}$/, 'Contact must be exactly 10 digits')
      .required('Contact number is required'),
    email: Yup.string().email('Invalid email address'),
    schoolId: Yup.string().required('School ID is required'),
    classId: Yup.string().required('Class is required'),
    class: Yup.string().required('Class is required'),
    subjects: Yup.array(),
    grade: Yup.string().required('Grade is required'),
    dob: Yup.date().required('Date of birth is required'),
  });

  const handleSubmit = values => {
    const data = {
      photo: photo?.path || '',
      studentName: values.name,
      age: calculateAge(values.dob) || 1,
      mobileNumber: values.contact,
      countryCode: '+91',
      grade: values.grade,
      schoolId: values.schoolId,
      classId: values.classId,
      className: values.class,
      subjects: selectedSubjects.map(subject => subject._id),
    };
    mutate({data});
  };

  const FormField = ({label, name, formikProps, icon, ...rest}) => {
    const hasError = formikProps.touched[name] && formikProps.errors[name];
    return (
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.inputContainer, hasError && styles.errorInput]}>
          {icon && <Text style={styles.inputIcon}>{icon}</Text>}
          <TextInput
            style={styles.input}
            value={formikProps.values[name]}
            onChangeText={text => {
              formikProps.handleChange(name)(text);
              if (name === 'schoolId') {
                useFetchSchoolDetailsForRegistration(text, setSchoolDetails);
              }
            }}
            onBlur={formikProps.handleBlur(name)}
            placeholderTextColor="#9E9E9E"
            {...rest}
          />
        </View>
        {name === 'schoolId' && schoolDetails?.school?.name ? (
          <Text style={{...styles.errorText, color: '#000', fontWeight: '500'}}>
            {schoolDetails?.school?.name}
          </Text>
        ) : null}
        {hasError && (
          <Text style={styles.errorText}>{formikProps.errors[name]}</Text>
        )}
      </View>
    );
  };

  const handleSelectClass = (classItem, formikProps) => {
    setSelectedClass(classItem);
    formikProps.setFieldValue('class', classItem.name);
    formikProps.setFieldValue('classId', classItem._id);
    setShowClassModal(false);
  };

  const toggleSubjectSelection = subject => {
    if (!subject.isElective) {
      // Non-elective subjects can't be toggled
      return;
    }

    const isSelected = selectedSubjects.some(sel => sel._id === subject._id);

    if (isSelected) {
      // Remove the subject if already selected
      setSelectedSubjects(
        selectedSubjects.filter(sel => sel._id !== subject._id),
      );
    } else {
      // Add the subject if not selected
      setSelectedSubjects([...selectedSubjects, subject]);
    }
  };

  const handleDatePicker = (date, formikProps) => {
    formikProps.setFieldValue('dob', date);
    setShowDatePicker(false);
  };

  const isSubjectSelected = subjectId => {
    return selectedSubjects.some(subject => subject._id === subjectId);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#3949AB', '#1E88E5']}
        style={styles.gradientHeader}>
        <View style={{...styles.header, paddingTop: insets.top}}>
          <Text style={styles.headerTitle}>Student Registration</Text>
          <Text style={styles.headerSubtitle}>Join our education network</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            {/* Photo Upload Section */}
            <View style={styles.photoUploadContainer}>
              <TouchableOpacity
                style={styles.photoContainer}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}>
                <View style={styles.photoWrapper}>
                  {photo?.path ? (
                    <Image
                      source={{uri: photo.path}}
                      style={styles.profileImage}
                    />
                  ) : (
                    <View style={styles.placeholderContainer}>
                      <View style={styles.cameraIconContainer}>
                        <Text style={styles.cameraIcon}>📷</Text>
                      </View>
                    </View>
                  )}
                </View>
                <LinearGradient
                  colors={['#4481EB', '#04BEFE']}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 1}}
                  style={styles.editBadge}>
                  <Text style={styles.editBadgeText}>+</Text>
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.photoHelpText}>Upload student photo</Text>
            </View>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              {formikProps => (
                <View style={styles.formFields}>
                  <FormField
                    label="Student Name"
                    name="name"
                    formikProps={formikProps}
                    placeholder="Student Name"
                    autoCapitalize="words"
                    icon="🎓"
                  />

                  <FormField
                    label="Mobile Number"
                    name="contact"
                    formikProps={formikProps}
                    placeholder="Mobile Number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    icon="📞"
                  />

                  <FormField
                    label="School ID"
                    name="schoolId"
                    formikProps={formikProps}
                    placeholder="School ID"
                    icon="🆔"
                  />

                  {/* Class Selection Field */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Class</Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (schoolDetails?.school?.classes) {
                          setShowClassModal(true);
                        } else {
                          showToast('Please enter a valid School ID first');
                        }
                      }}
                      activeOpacity={0.7}
                      style={[
                        styles.inputContainer,
                        formikProps.touched['class'] &&
                          formikProps.errors['class'] &&
                          styles.errorInput,
                      ]}>
                      <Text style={styles.inputIcon}>🏫</Text>
                      <Text
                        style={[
                          styles.input,
                          !formikProps.values['class'] &&
                            styles.placeholderText,
                        ]}>
                        {formikProps.values['class'] || 'Select Class'}
                      </Text>
                      <View style={styles.chevronContainer}>
                        <Text style={styles.chevronIcon}>›</Text>
                      </View>
                    </TouchableOpacity>
                    {formikProps.touched['class'] &&
                      formikProps.errors['class'] && (
                        <Text style={styles.errorText}>
                          {formikProps.errors['class']}
                        </Text>
                      )}
                  </View>

                  {/* Subjects Selection Field */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Subjects</Text>
                    <TouchableOpacity
                      onPress={() => {
                        if (selectedClass) {
                          setShowSubjectsModal(true);
                        } else {
                          showToast('Please select a class first');
                        }
                      }}
                      activeOpacity={0.7}
                      style={[styles.inputContainer]}>
                      <Text style={styles.inputIcon}>📚</Text>
                      <Text
                        style={[
                          styles.input,
                          selectedSubjects.length === 0 &&
                            styles.placeholderText,
                        ]}>
                        {selectedSubjects.length > 0
                          ? `${selectedSubjects.length} subjects selected`
                          : 'Select Subjects'}
                      </Text>
                      <View style={styles.chevronContainer}>
                        <Text style={styles.chevronIcon}>›</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <FormField
                    label="Grade"
                    name="grade"
                    formikProps={formikProps}
                    placeholder="Grade"
                    autoCapitalize="words"
                    icon="🏷️"
                  />

                  {/* DOB Picker */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.label}>Date of Birth</Text>
                    <TouchableOpacity
                      onPress={() => setShowDatePicker(true)}
                      activeOpacity={0.7}
                      style={[
                        styles.datePickerContainer,
                        formikProps.touched['dob'] &&
                          formikProps.errors['dob'] &&
                          styles.errorInput,
                      ]}>
                      <View style={styles.calendarIconContainer}>
                        <Text style={styles.calendarIcon}>🗓️</Text>
                      </View>
                      <Text
                        style={[
                          styles.datePickerText,
                          !formikProps.values['dob'] &&
                            styles.datePickerPlaceholder,
                        ]}>
                        {formikProps.values['dob']
                          ? formatDateToReadable(formikProps.values['dob'])
                          : 'Date of Birth'}
                      </Text>
                      <View style={styles.chevronContainer}>
                        <Text style={styles.chevronIcon}>›</Text>
                      </View>
                    </TouchableOpacity>
                    {formikProps.touched['dob'] &&
                      formikProps.errors['dob'] && (
                        <Text style={styles.errorText}>
                          {formikProps.errors['dob']}
                        </Text>
                      )}

                    {showDatePicker && (
                      <CustomDatePickerModal
                        isVisible={showDatePicker}
                        date={formikProps.values['dob'] || new Date()}
                        maximumDate={new Date()}
                        onConfirm={date => handleDatePicker(date, formikProps)}
                        onCancel={() => {
                          if (showDatePicker) {
                            setShowDatePicker(false);
                          }
                        }}
                      />
                    )}
                  </View>

                  <PrimaryButton
                    title="Register Student"
                    onPress={() => formikProps.handleSubmit()}
                  />

                  <Modal
                    visible={showClassModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowClassModal(false)}>
                    <View style={styles.modalOverlay}>
                      <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                          <Text style={styles.modalTitle}>Select Class</Text>
                          <TouchableOpacity
                            onPress={() => setShowClassModal(false)}>
                            <Ionicons name="close" size={24} color="#333" />
                          </TouchableOpacity>
                        </View>

                        <FlatList
                          data={schoolDetails?.school?.classes}
                          keyExtractor={item => item._id}
                          renderItem={({item}) => (
                            <TouchableOpacity
                              style={styles.modalItem}
                              onPress={() =>
                                handleSelectClass(item, formikProps)
                              }>
                              <View
                                style={[
                                  styles.classIconContainer,
                                  {backgroundColor: '#4F46E5'},
                                ]}>
                                <Text style={styles.classIconText}>
                                  {item.name.replace('Class ', '')}
                                </Text>
                              </View>
                              <Text style={styles.modalItemText}>
                                {item.name}
                              </Text>
                              {selectedClass &&
                                selectedClass._id === item._id && (
                                  <Ionicons
                                    name="checkmark"
                                    size={22}
                                    color="#4F46E5"
                                  />
                                )}
                            </TouchableOpacity>
                          )}
                          style={styles.modalList}
                        />
                      </View>
                    </View>
                  </Modal>

                  <Modal
                    visible={showSubjectsModal}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => setShowSubjectsModal(false)}>
                    <View style={styles.modalOverlay}>
                      <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                          <Text style={styles.modalTitle}>Select Subjects</Text>
                          <TouchableOpacity
                            onPress={() => setShowSubjectsModal(false)}>
                            <Ionicons name="close" size={24} color="#333" />
                          </TouchableOpacity>
                        </View>

                        {availableSubjects.length > 0 ? (
                          <FlatList
                            data={availableSubjects}
                            keyExtractor={item => item._id}
                            renderItem={({item}) => (
                              <TouchableOpacity
                                style={[
                                  styles.modalItem,
                                  !item.isElective && styles.disabledItem,
                                ]}
                                onPress={() => toggleSubjectSelection(item)}
                                disabled={!item.isElective}>
                                <View
                                  style={[
                                    styles.subjectIconContainer,
                                    {
                                      backgroundColor: item.isElective
                                        ? '#3B82F6'
                                        : '#94A3B8',
                                    },
                                  ]}>
                                  <Text style={styles.subjectIconText}>
                                    {item.name.substring(0, 2).toUpperCase()}
                                  </Text>
                                </View>
                                <View style={styles.subjectDetails}>
                                  <Text style={styles.modalItemText}>
                                    {item.name}
                                  </Text>
                                  <Text style={styles.subjectCodeText}>
                                    {item.code}
                                  </Text>
                                  <Text style={styles.subjectTypeText}>
                                    {item.isElective ? 'Elective' : 'Mandatory'}
                                  </Text>
                                </View>
                                {isSubjectSelected(item._id) && (
                                  <Ionicons
                                    name="checkmark"
                                    size={22}
                                    color="#4F46E5"
                                  />
                                )}
                              </TouchableOpacity>
                            )}
                            style={styles.modalList}
                          />
                        ) : (
                          <View style={styles.emptyStateContainer}>
                            <Text style={styles.emptyStateText}>
                              No subjects available for this class
                            </Text>
                          </View>
                        )}

                        <TouchableOpacity
                          style={styles.confirmButton}
                          onPress={() => setShowSubjectsModal(false)}>
                          <Text style={styles.confirmButtonText}>
                            Confirm Selection
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Modal>
                </View>
              )}
            </Formik>
          </View>
        </ScrollView>
        <ImagePickerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onImagePicked={img => setPhoto(img)}
          multiple={false}
          isProfileImage={true}
        />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  gradientHeader: {
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  header: {
    alignItems: 'center',
    padding: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: -30,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 15,
    shadowOffset: {width: 0, height: 5},
    elevation: 5,
  },
  photoPlaceholderText: {
    fontSize: 40,
    color: '#90CAF9',
  },
  formFields: {
    paddingHorizontal: 5,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 6,
    paddingLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F9FAFC',
    overflow: 'hidden',
    height: 55,
    paddingHorizontal: 12,
  },
  inputIcon: {
    fontSize: 16,
    paddingRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#424242',
  },
  placeholderText: {
    color: '#9E9E9E',
  },
  errorInput: {
    borderColor: '#FF5252',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF5252',
    fontSize: 12,
    marginTop: 4,
    paddingLeft: 4,
  },
  photoUploadContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: -20,
  },
  photoContainer: {
    position: 'relative',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoWrapper: {
    width: 130,
    height: 130,
    borderRadius: 65,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: '#fff',
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 65,
  },
  placeholderContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
  },
  cameraIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraIcon: {
    fontSize: 24,
    color: '#5C93D8',
  },
  editBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editBadgeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  photoHelpText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#F9FAFC',
    overflow: 'hidden',
    paddingHorizontal: 10,
    height: 55,
  },
  calendarIconContainer: {
    marginRight: 8,
  },
  calendarIcon: {
    fontSize: 16,
    color: '#4481EB',
  },
  datePickerText: {
    flex: 1,
    fontSize: 16,
    color: '#424242',
    fontWeight: '500',
  },
  datePickerPlaceholder: {
    color: '#9E9E9E',
    fontWeight: '400',
  },
  chevronContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(77, 129, 235, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chevronIcon: {
    fontSize: 18,
    color: '#4481EB',
    fontWeight: 'bold',
    transform: [{rotate: '90deg'}],
    lineHeight: 20,
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
  disabledItem: {
    opacity: 0.7,
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
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
  subjectIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  subjectIconText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  subjectDetails: {
    flex: 1,
  },
  subjectCodeText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  subjectTypeText: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
    marginTop: 2,
  },
  emptyStateContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  confirmButton: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StudentsRegistration;
