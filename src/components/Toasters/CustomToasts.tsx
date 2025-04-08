import {SafeAreaView, Text, View} from 'react-native';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';

export const toastConfig = {
  customToast: ({text1, props}: {text1: string; props: any}) => (
    <LinearGradient
      colors={['#FF7676', '#F54EA2']}
      start={{x: 0, y: 0}}
      end={{x: 1, y: 0}}
      style={{
        width: '100%',
      }}>
      <SafeAreaView
        style={{
          alignItems: 'center',
        }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: '500',
            color: 'white',
            textAlign: 'center',
            marginBottom: 5,
          }}>
          {text1}
        </Text>
      </SafeAreaView>
    </LinearGradient>
  ),
};

export const showToast = (text: string, task?: string) => {
  Toast.show({
    type: 'customToast',
    text1: text,
    props: {task},
    topOffset: 0,
  });
};
// export const showSmallToast = (text: string, task?: string) => {
//   Toast.show({
//     type: 'smallToast',
//     text1: text,
//     props: {task},
//     topOffset: 0,
//   });
// };
