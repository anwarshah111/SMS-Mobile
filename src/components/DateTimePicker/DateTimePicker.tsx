import {View, Text} from 'react-native';
import React from 'react';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const CustomDatePickerModal = (props: any) => {
  const {isVisible, date, maximumDate, onConfirm, onCancel} = props || {};
  return (
    <View>
      <DateTimePickerModal
        isVisible={isVisible}
        mode={'date'}
        locale="en_GB"
        date={date}
        display={'spinner'}
        maximumDate={maximumDate}
        onConfirm={onConfirm}
        onCancel={onCancel}
        timeZoneName={'Asia/Kolkata'}
        is24Hour={false}
      />
    </View>
  );
};

export default CustomDatePickerModal;

export const CustomTimePickerModal = (props: any) => {
  const {isVisible, date, maximumDate, onConfirm, onCancel} = props || {};
  return (
    <View>
      <DateTimePickerModal
        isVisible={isVisible}
        mode={'time'}
        locale="en_GB"
        date={date}
        display={'spinner'}
        maximumDate={maximumDate}
        onConfirm={onConfirm}
        onCancel={onCancel}
        timeZoneName={'Asia/Kolkata'}
        is24Hour={false}
      />
    </View>
  );
};
