import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const SchoolLogin = ({navigation}: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailInputRef = useRef(null);

  const handleRegistration = () => {
    // Handle registration flow
    navigation.navigate('SchoolRegistration');
    console.log('Navigate to registration');
  };

  const navigateToSchoolLogin = () => {
    // Navigate to school login screen
    navigation.goBack();
  };

  const handleLogin = () => {
    console.log('LOgin');
  };

  // Phone number input screen
  const renderPhoneScreen = () => (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <LinearGradient
          colors={['#5E72E4', '#825EE4']}
          style={styles.logoBackground}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <Image source={{uri: '/api/placeholder/80/80'}} style={styles.logo} />
        </LinearGradient>
      </View>

      <Text style={styles.title}>Login to Your School</Text>
      <Text style={styles.subtitle}>
        Enter your email and password to continue
      </Text>

      <View style={styles.inputContainer}>
        <View style={styles.phoneInputWrapper}>
          <TextInput
            ref={emailInputRef}
            style={styles.phoneInput}
            placeholder="Email"
            keyboardType="email-address"
            value={email}
            onChangeText={text => setEmail(text)}
            autoFocus={false}
            maxLength={10}
          />
        </View>
        <View style={styles.phoneInputWrapper}>
          <TextInput
            style={styles.phoneInput}
            placeholder="Password"
            keyboardType="visible-password"
            value={password}
            onChangeText={text => setPassword(text)}
            autoFocus={false}
          />
        </View>
      </View>

      <LinearGradient
        colors={['#5E72E4', '#825EE4']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.continueButtonGradient}>
        <TouchableOpacity style={styles.continueButton} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </LinearGradient>

      <LinearGradient
        colors={['#FF7676', '#F54EA2']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={[styles.continueButtonGradient, styles.registerButtonGradient]}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleRegistration}>
          <Text style={styles.buttonText}>Register School</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.schoolLoginContainer}>
        <Text style={styles.schoolLoginText}>Are you a student?</Text>
        <TouchableOpacity onPress={navigateToSchoolLogin}>
          <Text style={styles.schoolLoginLink}>Login here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}>
        <TouchableWithoutFeedback>
          {renderPhoneScreen()}
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardAvoid: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBackground: {
    padding: 12,
    borderRadius: 20,
    shadowColor: '#5E72E4',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    // textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 10,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 60,
    marginBottom: 10,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 10,
    color: '#333',
  },
  phoneInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  continueButtonGradient: {
    borderRadius: 14,
    shadowColor: '#5E72E4',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  registerButtonGradient: {
    marginTop: 15,
    shadowColor: '#F54EA2',
  },
  continueButton: {
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 14,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  schoolLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    alignItems: 'center',
  },
  schoolLoginText: {
    fontSize: 14,
    color: '#666',
  },
  schoolLoginLink: {
    fontSize: 14,
    color: '#5E72E4',
    fontWeight: '600',
    marginLeft: 5,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 5,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 65,
    height: 65,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    backgroundColor: '#F9F9F9',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  otpInputFilled: {
    borderColor: '#5E72E4',
    backgroundColor: '#F0F3FF',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  resendText: {
    fontSize: 14,
    color: '#666',
  },
  resendButton: {
    fontSize: 14,
    color: '#5E72E4',
    fontWeight: '600',
  },
});

export default SchoolLogin;
