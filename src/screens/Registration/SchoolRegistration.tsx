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

const SchoolRegistration = () => {
  const insets = useSafeAreaInsets();
  const initialValues = {
    name: '',
    address: '',
    contact: '',
    email: '',
    website: '',
    principal: '',
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
    website: Yup.string()
      .url('Invalid URL format')
      .required('Website is required'),
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
    // In a real app, you would send this data to your API
    console.log('Form submitted with values:', values);
    Alert.alert(
      'Registration Successful',
      'School registration information has been submitted',
      [{text: 'OK'}],
    );
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
                    placeholder="e.g. Springfield High School"
                    autoCapitalize="words"
                    icon="🏫"
                  />

                  <FormField
                    label="Address"
                    name="address"
                    formikProps={formikProps}
                    placeholder="e.g. 742 Evergreen Terrace, Springfield"
                    multiline
                    numberOfLines={2}
                    icon="📍"
                  />

                  <FormField
                    label="Contact Number"
                    name="contact"
                    formikProps={formikProps}
                    placeholder="e.g. 9876543210"
                    keyboardType="phone-pad"
                    maxLength={10}
                    icon="📞"
                  />

                  <FormField
                    label="Email Address"
                    name="email"
                    formikProps={formikProps}
                    placeholder="e.g. contact@springfieldhigh.edu"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    icon="✉️"
                  />

                  <FormField
                    label="Website"
                    name="website"
                    formikProps={formikProps}
                    placeholder="e.g. https://springfieldhigh.edu"
                    autoCapitalize="none"
                    keyboardType="url"
                    icon="🌐"
                  />

                  <FormField
                    label="Principal Name"
                    name="principal"
                    formikProps={formikProps}
                    placeholder="e.g. John Doe"
                    autoCapitalize="words"
                    icon="👤"
                  />

                  <FormField
                    label="Established Year"
                    name="establishedYear"
                    formikProps={formikProps}
                    placeholder="e.g. 1995"
                    keyboardType="numeric"
                    maxLength={4}
                    icon="📅"
                  />

                  <FormField
                    label="Board"
                    name="board"
                    formikProps={formikProps}
                    placeholder="e.g. CBSE"
                    autoCapitalize="characters"
                    icon="🎓"
                  />

                  <FormField
                    label="Student Capacity"
                    name="studentCapacity"
                    formikProps={formikProps}
                    placeholder="e.g. 1200"
                    keyboardType="numeric"
                    icon="👥"
                  />
                  <PrimaryButton
                    title="Register School"
                    onPress={() => {}}
                    // disabled={formikProps.is}
                  />
                </View>
              )}
            </Formik>
          </View>
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
    paddingBottom: 30,
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
    // marginTop: -30,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.1,
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
});

export default SchoolRegistration;
