// App.js
import React, {useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from 'react-native';
import Ionics from 'react-native-vector-icons/Ionicons';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {
  CustomDropdown,
  CustomDateField,
} from '../../components/DateTimePicker/CustomFunctions';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import ImagePickerModal from '../../components/ImagePickers/ImagePicker';
import {useAddTeachersMutation} from '../../queries/schoolQueries/schoolQueries';
import {useRoute} from '@react-navigation/native';
import {showToast} from '../../components/Toasters/CustomToasts';
import {Ionicons} from 'react-native-vector-icons/Ionicons';

const genderOptions = [
  {label: 'Male', value: 'Male'},
  {label: 'Female', value: 'Female'},
  {label: 'Other', value: 'Other'},
];

const statusOptions = [
  {label: 'Active', value: 'A'},
  {label: 'Inactive', value: 'I'},
];
const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  phone: Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be 10 digits')
    .required('Phone is required'),
  countryCode: Yup.string().required('Country code is required'),
  subject: Yup.string().required('Subject is required'),
  qualification: Yup.string().required('Qualification is required'),
  experience: Yup.number()
    .positive('Experience must be positive')
    .required('Experience is required'),
  gender: Yup.string().required('Gender is required'),
  dob: Yup.date().required('Date of birth is required'),
  address: Yup.string().required('Address is required'),
  joiningDate: Yup.date().required('Joining date is required'),
  status: Yup.string().required('Status is required'),
});
const AddTeachersScreen = ({navigation}: any) => {
  const routes = useRoute();
  const schoolId = routes?.params?.schoolId;
  const insets = useSafeAreaInsets();
  const [profilePicture, setProfilePicture] = useState(null);
  const [imagePickerModal, setImagePickerModal] = useState(false);
  const {mutate} = useAddTeachersMutation({
    onSuccess: () => {
      showToast('Teacher added successfully');
      navigation.goBack();
    },
    onError: error => {
      showToast(error.response.data?.message);
    },
  });

  const initialValues = {
    schoolId: schoolId,
    name: '',
    email: '',
    phone: '',
    countryCode: '+91',
    subject: '',
    qualification: '',
    experience: '',
    gender: '',
    dob: new Date('1990-06-15'),
    address: '',
    joiningDate: new Date(),
    profilePicture: '',
    status: 'A',
  };

  const formatDate = date => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0',
    )}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const handleSubmit = values => {
    const formattedValues = {
      ...values,
      dob: formatDate(values.dob),
      joiningDate: formatDate(values.joiningDate),
    };
    mutate({data: formattedValues});
    // console.log('Submitting teacher data:', formattedValues);
    // Alert.alert('Success', 'Teacher added successfully');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#5E72E4" />
      <View style={{...styles.header, paddingTop: insets.top}}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Ionics name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Teacher</Text>
      </View>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}>
        {({
          handleChange,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
        }) => (
          <ScrollView
            style={styles.formContainer}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formContentContainer}>
            <View style={styles.photoUploadContainer}>
              <TouchableOpacity
                style={styles.photoContainer}
                onPress={() => setImagePickerModal(true)}
                activeOpacity={0.7}>
                <View style={styles.photoWrapper}>
                  {profilePicture ? (
                    <Image
                      source={profilePicture}
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
              <Text style={styles.photoHelpText}>Upload teacher profile</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                value={values.name}
                onChangeText={handleChange('name')}
                onBlur={() => setFieldTouched('name')}
                style={[
                  styles.input,
                  touched.name && errors.name && styles.inputError,
                ]}
                placeholder="Enter full name"
                placeholderTextColor="#98A2B3"
              />
              {touched.name && errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={() => setFieldTouched('email')}
                style={[
                  styles.input,
                  touched.email && errors.email && styles.inputError,
                ]}
                placeholder="Enter email address"
                placeholderTextColor="#98A2B3"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {touched.email && errors.email && (
                <Text style={styles.errorText}>{errors.email}</Text>
              )}
            </View>

            <View style={styles.phoneContainer}>
              <View style={styles.countryCodeContainer}>
                <Text style={styles.label}>Country Code</Text>
                <TextInput
                  value={values.countryCode}
                  onChangeText={handleChange('countryCode')}
                  onBlur={() => setFieldTouched('countryCode')}
                  style={[
                    styles.countryCodeInput,
                    touched.countryCode &&
                      errors.countryCode &&
                      styles.inputError,
                  ]}
                  editable={false}
                  placeholder="+91"
                  placeholderTextColor="#98A2B3"
                />
                {touched.countryCode && errors.countryCode && (
                  <Text style={styles.errorText}>{errors.countryCode}</Text>
                )}
              </View>

              <View style={styles.phoneNumberContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  value={values.phone}
                  onChangeText={handleChange('phone')}
                  onBlur={() => setFieldTouched('phone')}
                  style={[
                    styles.phoneInput,
                    touched.phone && errors.phone && styles.inputError,
                  ]}
                  placeholder="10-digit number"
                  placeholderTextColor="#98A2B3"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
                {touched.phone && errors.phone && (
                  <Text style={styles.errorText}>{errors.phone}</Text>
                )}
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Subject</Text>
              <TextInput
                value={values.subject}
                onChangeText={handleChange('subject')}
                onBlur={() => setFieldTouched('subject')}
                style={[
                  styles.input,
                  touched.subject && errors.subject && styles.inputError,
                ]}
                placeholder="Enter subject"
                placeholderTextColor="#98A2B3"
              />
              {touched.subject && errors.subject && (
                <Text style={styles.errorText}>{errors.subject}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Qualification</Text>
              <TextInput
                value={values.qualification}
                onChangeText={handleChange('qualification')}
                onBlur={() => setFieldTouched('qualification')}
                style={[
                  styles.input,
                  touched.qualification &&
                    errors.qualification &&
                    styles.inputError,
                ]}
                placeholder="Enter qualification"
                placeholderTextColor="#98A2B3"
              />
              {touched.qualification && errors.qualification && (
                <Text style={styles.errorText}>{errors.qualification}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Experience (Years)</Text>
              <TextInput
                value={values.experience.toString()}
                onChangeText={text =>
                  setFieldValue('experience', text.replace(/[^0-9]/g, ''))
                }
                onBlur={() => setFieldTouched('experience')}
                style={[
                  styles.input,
                  touched.experience && errors.experience && styles.inputError,
                ]}
                placeholder="Enter years of experience"
                placeholderTextColor="#98A2B3"
                keyboardType="numeric"
              />
              {touched.experience && errors.experience && (
                <Text style={styles.errorText}>{errors.experience}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <CustomDropdown
                options={genderOptions}
                value={values.gender}
                onChange={value => setFieldValue('gender', value)}
                placeholder="Select Gender"
                error={errors.gender}
                touched={touched.gender}
              />
            </View>

            <View style={styles.inputContainer}>
              <CustomDateField
                value={values.dob}
                onChange={date => setFieldValue('dob', date)}
                label="Date of Birth"
                error={errors.dob}
                touched={touched.dob}
                formatDate={formatDate}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Address</Text>
              <TextInput
                value={values.address}
                onChangeText={handleChange('address')}
                onBlur={() => setFieldTouched('address')}
                style={[
                  styles.input,
                  styles.textArea,
                  touched.address && errors.address && styles.inputError,
                ]}
                placeholder="Enter full address"
                placeholderTextColor="#98A2B3"
                multiline={true}
                numberOfLines={3}
              />
              {touched.address && errors.address && (
                <Text style={styles.errorText}>{errors.address}</Text>
              )}
            </View>

            <View style={styles.inputContainer}>
              <CustomDateField
                value={values.joiningDate}
                onChange={date => setFieldValue('joiningDate', date)}
                label="Joining Date"
                error={errors.joiningDate}
                touched={touched.joiningDate}
                formatDate={formatDate}
              />
            </View>

            <View style={styles.inputContainer}>
              <CustomDropdown
                options={statusOptions}
                value={values.status}
                onChange={value => setFieldValue('status', value)}
                placeholder="Select Status"
                error={errors.status}
                touched={touched.status}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>Add Teacher</Text>
            </TouchableOpacity>
            <ImagePickerModal
              visible={imagePickerModal}
              onClose={() => setImagePickerModal(false)}
              onImagePicked={img => {
                setProfilePicture({uri: img.path});
                setFieldValue('profilePicture', img.path);
              }}
              multiple={false}
              isProfileImage={true}
            />
          </ScrollView>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
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
  formContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  formContentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 100,
    overflow: 'hidden',
    backgroundColor: '#F2F4F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E4E7EC',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 8,
    color: '#667085',
    fontSize: 14,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    fontSize: 16,
    color: '#101828',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  inputError: {
    borderColor: '#F97066',
    borderWidth: 1.5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  phoneContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  countryCodeContainer: {
    flex: 0.3,
  },
  phoneNumberContainer: {
    flex: 0.65,
  },
  countryCodeInput: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    fontSize: 16,
    color: '#101828',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  phoneInput: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    fontSize: 16,
    color: '#101828',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  errorText: {
    color: '#F97066',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#5E72E4',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 28,
    elevation: 4,
    shadowColor: '#5E72E4',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  photoUploadContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
});

export default AddTeachersScreen;
