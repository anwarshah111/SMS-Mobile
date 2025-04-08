import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {LinearGradient} from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import ImagePickerModal from '../../components/ImagePickers/ImagePicker';
import CustomDatePickerModal from '../../components/DateTimePicker/DateTimePicker';
import {calculateAge, formatDateToReadable} from '../../utility/utility';
import {useRegisterStudentsMutation} from '../../queries/studentQueries/studentQueries';
import {showToast} from '../../components/Toasters/CustomToasts';

const StudentsRegistration = ({navigation}: any) => {
  const insets = useSafeAreaInsets();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [photo, setPhoto] = useState(null);
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

  const initialValues = {
    name: '',
    contact: '',
    email: '',
    grade: '',
    schoolId: '',
    dob: '',
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Student name is required'),
    contact: Yup.string()
      .matches(/^\d{10}$/, 'Contact must be exactly 10 digits')
      .required('Contact number is required'),
    email: Yup.string().email('Invalid email address'),
    schoolId: Yup.string().required('School ID is required'),
    grade: Yup.string().required('Grade is required'),
    dob: Yup.date().required('Date of birth is required'),
  });

  const handleSubmit = (values: any) => {
    const data = {
      photo: photo?.path || '',
      studentName: values.name,
      age: calculateAge(values.dob) || 1,
      mobileNumber: values.contact,
      countryCode: '+91',
      grade: values.grade,
      schoolId: values.schoolId,
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
            onChangeText={formikProps.handleChange(name)}
            onBlur={formikProps.handleBlur(name)}
            placeholderTextColor="#9E9E9E"
            {...rest}
          />
        </View>
        {hasError && (
          <Text style={styles.errorText}>{formikProps.errors[name]}</Text>
        )}
      </View>
    );
  };

  const handleDatePicker = (date: any, formikProps: any) => {
    formikProps.setFieldValue('dob', date);
    setShowDatePicker(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#3949AB', '#1E88E5']}
        style={styles.gradientHeader}>
        <View style={{...styles.header, paddingTop: insets.top}}>
          <Text style={styles.headerTitle}>Students Registration</Text>
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
                        onConfirm={(date: Date) =>
                          handleDatePicker(date, formikProps)
                        }
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
    // paddingBottom: 30,
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
    marginTop: 10,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 40,
    shadowOpacity: 0.2,
    shadowRadius: 15,
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
  datePickerGradient: {
    flex: 1,
    borderRadius: 12,
  },
  datePickerContent: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
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
});

export default StudentsRegistration;
