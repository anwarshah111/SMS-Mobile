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
  SafeAreaView,
  Alert,
  Image,
  StatusBar,
} from 'react-native';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {LinearGradient} from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import PrimaryButton from '../../components/Buttons/PrimaryButton';
import {useRegisterSchoolssMutation} from '../../queries/schoolQueries/schoolQueries';
import {showToast} from '../../components/Toasters/CustomToasts';
import ImagePickerModal from '../../components/ImagePickers/ImagePicker';

const SchoolRegistration = ({navigation}: any) => {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [photo, setPhoto] = useState(null);

  const {mutate} = useRegisterSchoolssMutation({
    onSuccess: () => {
      navigation.goBack();
      showToast('Request sent to admin!');
    },
    onError: error => {
      if (error.response.data?.code === 'DUP_EMAIL') {
        showToast('School with this email already exists!');
      } else if (error.response.data?.code === 'INVALID_SCHOOL_ID') {
        showToast('Invalid School ID!');
      } else {
        console.log('error', error.response.data);
        showToast(error.response.data?.message);
      }
    },
  });
  const initialValues = {
    name: '',
    address: '',
    contact: '',
    email: '',
    website: '',
    principal: '',
    password: '',
    establishedYear: '',
    board: '',
    studentCapacity: '',
  };

  // Form validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('School name is required'),
    address: Yup.string().required('Address is required'),
    contact: Yup.string()
      .matches(/^\d{10}$/, 'Contact must be exactly 10 digits')
      .required('Contact number is required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string().required('password is required'),
    website: Yup.string().url('Invalid URL format').notRequired(),
    principal: Yup.string().required('Principal name is required'),
    establishedYear: Yup.number()
      .typeError('Year must be a number')
      .min(1800, 'Year must be after 1800')
      .max(new Date().getFullYear(), 'Year cannot be in the future')
      .required('Established year is required'),
    board: Yup.string().required('Board is required'),
    studentCapacity: Yup.number()
      .typeError('Capacity must be a number')
      .positive('Capacity must be positive')
      .required('Student capacity is required'),
  });

  const handleSubmit = values => {
    const data = {
      ...values,
      countryCode: '+91',
      photo: photo?.path || '',
    };
    // console.log(data);
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={['#3949AB', '#1E88E5']}
        style={{...styles.gradientHeader}}>
        <View style={{...styles.header, paddingTop: insets.top}}>
          <Text style={styles.headerTitle}>School Registration</Text>
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
            {/* <View style={styles.schoolIconContainer}>
              <View style={styles.schoolIconBackground}>
                <Text style={styles.schoolIconText}>🏫</Text>
              </View>
            </View> */}
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
              <Text style={styles.photoHelpText}>Upload school profile</Text>
            </View>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}>
              {formikProps => (
                <View style={styles.formFields}>
                  <FormField
                    label="School Name"
                    name="name"
                    formikProps={formikProps}
                    placeholder="School Name"
                    autoCapitalize="words"
                    icon="🏫"
                  />

                  <FormField
                    label="Address"
                    name="address"
                    formikProps={formikProps}
                    placeholder="Address"
                    multiline
                    numberOfLines={2}
                    icon="📍"
                  />

                  <FormField
                    label="Contact Number"
                    name="contact"
                    formikProps={formikProps}
                    placeholder="Contact Number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    icon="📞"
                  />

                  <FormField
                    label="Email Address"
                    name="email"
                    formikProps={formikProps}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    icon="✉️"
                  />

                  <FormField
                    label="Password"
                    name="password"
                    formikProps={formikProps}
                    placeholder="Password"
                    keyboardType="default"
                    autoCapitalize="none"
                    icon="✉️"
                  />

                  <FormField
                    label="Website"
                    name="website"
                    formikProps={formikProps}
                    placeholder="Website"
                    autoCapitalize="none"
                    keyboardType="url"
                    icon="🌐"
                  />

                  <FormField
                    label="Principal Name"
                    name="principal"
                    formikProps={formikProps}
                    placeholder="Principal Name"
                    autoCapitalize="words"
                    icon="👤"
                  />

                  <FormField
                    label="Established Year"
                    name="establishedYear"
                    formikProps={formikProps}
                    placeholder="Established Year"
                    keyboardType="numeric"
                    maxLength={4}
                    icon="📅"
                  />

                  <FormField
                    label="Board"
                    name="board"
                    formikProps={formikProps}
                    placeholder="Board"
                    autoCapitalize="characters"
                    icon="🎓"
                  />

                  <FormField
                    label="Student Capacity"
                    name="studentCapacity"
                    formikProps={formikProps}
                    placeholder="Student Capacity"
                    keyboardType="numeric"
                    icon="👥"
                  />
                  <PrimaryButton
                    title="Register School"
                    onPress={() => formikProps.handleSubmit()}
                    // disabled={formikProps.is}
                  />
                </View>
              )}
            </Formik>
          </View>
          <ImagePickerModal
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            onImagePicked={img => setPhoto(img)}
            multiple={false}
            isProfileImage={true}
          />
        </ScrollView>
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
    // paddingHorizontal: 20,
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
  schoolIconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  schoolIconBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -60,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  schoolIconText: {
    fontSize: 40,
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
  },
  inputIcon: {
    fontSize: 16,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 55,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#424242',
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
  buttonContainer: {
    marginTop: 15,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#1976D2',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
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
});

export default SchoolRegistration;
