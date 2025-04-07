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

const StudentLogin = ({navigation}: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const phoneInputRef = useRef(null);
  const otpInputRefs = useRef([...Array(4)].map(() => React.createRef()));

  const handleRegistration = () => {
    // Handle registration flow
    // console.log('Navigate to registration');
    navigation.navigate('StudentsRegistration');
  };

  const navigateToSchoolLogin = () => {
    navigation.navigate('SchoolLogin');
  };

  const handleSendOtp = () => {
    if (phoneNumber.length >= 10) {
      // In a real app, you would call an API to send OTP
      console.log('Sending OTP to', phoneNumber);
      setShowOtpScreen(true);

      // Focus on first OTP input after a short delay (to allow screen transition)
      setTimeout(() => {
        if (otpInputRefs.current[0]?.current) {
          otpInputRefs.current[0].current.focus();
        }
      }, 300);
    } else {
      // Show error message for invalid phone number
      alert('Please enter a valid phone number');
    }
  };

  const handleBackToPhone = () => {
    setShowOtpScreen(false);
    setOtp(['', '', '', '']);
  };

  const handleOtpChange = (text, index) => {
    // Update the OTP state for this input
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-advance to next input if this one is filled and not the last one
    if (text.length === 1 && index < 3) {
      otpInputRefs.current[index + 1].current.focus();
    }
  };

  const handleOtpKeyPress = (event, index) => {
    // Handle backspace to go to previous input
    if (
      event.nativeEvent.key === 'Backspace' &&
      index > 0 &&
      otp[index] === ''
    ) {
      otpInputRefs.current[index - 1].current.focus();
    }
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join('');
    if (otpString.length === 4) {
      // In a real app, you would verify the OTP with your backend
      console.log('Verifying OTP:', otpString);
      // Simulating successful verification
      alert('OTP verified successfully!');
      // Navigate to next screen or show success message
    } else {
      alert('Please enter a valid 4-digit OTP');
    }
  };

  const handleResendOtp = () => {
    // Reset OTP inputs
    setOtp(['', '', '', '']);

    // In a real app, call API to resend OTP
    console.log('Resending OTP to', phoneNumber);

    // Focus on first input
    setTimeout(() => {
      if (otpInputRefs.current[0]?.current) {
        otpInputRefs.current[0].current.focus();
      }
    }, 300);
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

      <Text style={styles.title}>Login to Your Account</Text>
      <Text style={styles.subtitle}>Enter your phone number to continue</Text>

      <View style={styles.inputContainer}>
        <View style={styles.phoneInputWrapper}>
          <Text style={styles.countryCode}>+91</Text>
          <TextInput
            ref={phoneInputRef}
            style={styles.phoneInput}
            placeholder="Phone Number"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text)}
            autoFocus={false}
            maxLength={10}
          />
        </View>
      </View>

      <LinearGradient
        colors={['#5E72E4', '#825EE4']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.continueButtonGradient}>
        <TouchableOpacity style={styles.continueButton} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Send OTP</Text>
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
          <Text style={styles.buttonText}>Register Now</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.schoolLoginContainer}>
        <Text style={styles.schoolLoginText}>Are you a school?</Text>
        <TouchableOpacity onPress={navigateToSchoolLogin}>
          <Text style={styles.schoolLoginLink}>Login here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // OTP verification screen
  const renderOtpScreen = () => (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={handleBackToPhone}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      <View style={styles.logoContainer}>
        <LinearGradient
          colors={['#5E72E4', '#825EE4']}
          style={styles.logoBackground}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}>
          <Image source={{uri: '/api/placeholder/80/80'}} style={styles.logo} />
        </LinearGradient>
      </View>

      <Text style={styles.title}>Verify Your Number</Text>
      <Text style={styles.subtitle}>
        Enter the 4-digit code sent to {'\n'}+91 {phoneNumber}
      </Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={otpInputRefs.current[index]}
            style={[styles.otpInput, digit ? styles.otpInputFilled : {}]}
            keyboardType="number-pad"
            maxLength={1}
            value={digit}
            onChangeText={text => handleOtpChange(text, index)}
            onKeyPress={e => handleOtpKeyPress(e, index)}
          />
        ))}
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive the code? </Text>
        <TouchableOpacity onPress={handleResendOtp}>
          <Text style={styles.resendButton}>Resend OTP</Text>
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={['#5E72E4', '#825EE4']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.continueButtonGradient}>
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleVerifyOtp}>
          <Text style={styles.buttonText}>Verify & Continue</Text>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  );

  return (
    <View style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={styles.keyboardAvoid}>
        <TouchableWithoutFeedback>
          {showOtpScreen ? renderOtpScreen() : renderPhoneScreen()}
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
    // marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    // textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  phoneInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 60,
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
    marginTop: 15,
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

export default StudentLogin;
