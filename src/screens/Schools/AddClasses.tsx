import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Ionics from 'react-native-vector-icons/Ionicons';
import {
  useAddSchoolClassMutation,
  useFetchSchoolTeachers,
} from '../../queries/schoolQueries/schoolQueries';
import {showToast} from '../../components/Toasters/CustomToasts';

const AddClassroomScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const routes = useRoute();
  const schoolId = routes?.params?.schoolId;
  const [classTeacherId, setClassTeacherId] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    section: 'A',
    classTeacher: '',
    strength: '',
  });

  const [errors, setErrors] = useState({});
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [teacherDropdownVisible, setTeacherDropdownVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState('');
  const classTeacherData = useFetchSchoolTeachers(schoolId);
  const {mutate} = useAddSchoolClassMutation({
    onSuccess: () => {
      showToast('Class added successfully');
      navigation.goBack();
    },
    onError: error => {
      showToast(error.response.data?.message);
    },
  });

  const sections = ['A', 'B', 'C', 'D', 'E'];

  const validate = () => {
    let tempErrors = {};

    if (!formData.name) tempErrors.name = 'Class name is required';
    if (!formData.classTeacher)
      tempErrors.classTeacher = 'Class teacher is required';
    if (!formData.strength) {
      tempErrors.strength = 'Student strength is required';
    } else if (isNaN(formData.strength) || parseInt(formData.strength) <= 0) {
      tempErrors.strength = 'Please enter a valid number';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // Create a new classroom object
      const newClassroom = {
        ...formData,
        classTeacherId: classTeacherId,
        schoolId: schoolId,
        strength: parseInt(formData.strength),
      };

      // Here you would typically send this data to your API
      // console.log('Submitting new classroom:', newClassroom);
      mutate({data: newClassroom});
    }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear error when user types
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: null,
      });
    }
  };

  const showDropdown = type => {
    setActiveDropdown(type);
    if (type === 'section') {
      setDropdownVisible(true);
      setTeacherDropdownVisible(false);
    } else if (type === 'teacher') {
      setTeacherDropdownVisible(true);
      setDropdownVisible(false);
    }
  };

  // Custom dropdown item renderer for sections
  const renderSectionItem = ({item}) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        handleInputChange('section', item);
        setDropdownVisible(false);
      }}>
      <Text
        style={[
          styles.dropdownItemText,
          formData.section === item && styles.dropdownItemTextActive,
        ]}>
        Section {item}
      </Text>
      {formData.section === item && (
        <Text style={styles.dropdownItemCheck}>✓</Text>
      )}
    </TouchableOpacity>
  );

  const renderTeacherItem = ({item}) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => {
        handleInputChange('classTeacher', item?.name);
        setClassTeacherId(item?._id);
        // handleInputChange('classTeacherId', item);
        setTeacherDropdownVisible(false);
      }}>
      <Text
        style={[
          styles.dropdownItemText,
          formData.classTeacher === item?.name && styles.dropdownItemTextActive,
        ]}>
        {item?.name}
      </Text>
      {formData.classTeacher === item?.name && (
        <Text style={styles.dropdownItemCheck}>✓</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}>
        <View style={{...styles.header, paddingTop: insets.top}}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionics name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add New Classroom</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.formContainer}>
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Class Name*</Text>
                <TextInput
                  style={[styles.input, errors.name && styles.inputError]}
                  placeholder="e.g. Class 8"
                  value={formData.name}
                  onChangeText={text => handleInputChange('name', text)}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Section*</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => showDropdown('section')}>
                  <Text style={styles.dropdownButtonText}>
                    Section {formData.section}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>Teacher & Students</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Class Teacher*</Text>
                <TouchableOpacity
                  style={[
                    styles.dropdownButton,
                    errors.classTeacher && styles.inputError,
                  ]}
                  onPress={() => showDropdown('teacher')}>
                  <Text
                    style={[
                      styles.dropdownButtonText,
                      !formData.classTeacher && styles.placeholderText,
                    ]}>
                    {formData.classTeacher || 'Select a teacher'}
                  </Text>
                  <Text style={styles.dropdownArrow}>▼</Text>
                </TouchableOpacity>
                {errors.classTeacher && (
                  <Text style={styles.errorText}>{errors.classTeacher}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Student Strength*</Text>
                <TextInput
                  style={[styles.input, errors.strength && styles.inputError]}
                  placeholder="e.g. 45"
                  value={formData.strength}
                  onChangeText={text => handleInputChange('strength', text)}
                  keyboardType="numeric"
                />
                {errors.strength && (
                  <Text style={styles.errorText}>{errors.strength}</Text>
                )}
              </View>
            </View>

            <View style={styles.preview}>
              <Text style={styles.previewTitle}>Preview</Text>

              <View style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <View>
                    <Text style={styles.previewClassName}>
                      {formData.name || 'Class Name'}
                    </Text>
                    <View style={styles.previewSectionBadge}>
                      <Text style={styles.previewSectionText}>
                        Section {formData.section}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.previewStrength}>
                    <Text style={styles.previewStrengthValue}>
                      {formData.strength || '0'}
                    </Text>
                    <Text style={styles.previewStrengthLabel}>Students</Text>
                  </View>
                </View>

                <View style={styles.previewDivider} />

                <View style={styles.previewTeacher}>
                  <View style={styles.previewTeacherAvatar}>
                    <Text style={styles.previewTeacherInitial}>
                      {formData.classTeacher ? formData.classTeacher[0] : '?'}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.previewTeacherLabel}>
                      Class Teacher
                    </Text>
                    <Text style={styles.previewTeacherName}>
                      {formData.classTeacher || 'Teacher Name'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Create Classroom</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Modal
        visible={dropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDropdownVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}>
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownTitle}>Select Section</Text>
            <FlatList
              data={sections}
              renderItem={renderSectionItem}
              keyExtractor={item => item}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={teacherDropdownVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setTeacherDropdownVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setTeacherDropdownVisible(false)}>
          <View style={styles.dropdownContainer}>
            <Text style={styles.dropdownTitle}>Select Teacher</Text>
            <FlatList
              data={classTeacherData?.data?.teachers}
              renderItem={renderTeacherItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.dropdownList}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardAvoidView: {
    flex: 1,
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
  backButtonText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#495057',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  formContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  formSection: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#495057',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#212529',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
  placeholderText: {
    color: '#adb5bd',
  },
  // Custom dropdown styles
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ced4da',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fff',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#212529',
  },
  dropdownArrow: {
    fontSize: 12,
    color: '#6c757d',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  dropdownList: {
    maxHeight: 300,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#212529',
  },
  dropdownItemTextActive: {
    fontWeight: '600',
    color: '#4F46E5',
  },
  dropdownItemCheck: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  // Preview styles
  preview: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 16,
  },
  previewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  previewClassName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  previewSectionBadge: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  previewSectionText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '600',
  },
  previewStrength: {
    backgroundColor: '#f1f8ff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
  },
  previewStrengthValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  previewStrengthLabel: {
    fontSize: 12,
    color: '#4F46E5',
    opacity: 0.8,
  },
  previewDivider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 16,
  },
  previewTeacher: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewTeacherAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  previewTeacherInitial: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#495057',
  },
  previewTeacherLabel: {
    fontSize: 12,
    color: '#6c757d',
  },
  previewTeacherName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    flexDirection: 'row',
    padding: 16,
    paddingBottom: Platform.OS === 'ios' ? 32 : 16,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ced4da',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    flex: 2,
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AddClassroomScreen;
