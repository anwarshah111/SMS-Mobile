import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const CustomDropdown = ({
  options,
  value,
  onChange,
  placeholder,
  error,
  touched,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        style={[styles.dropdownButton, touched && error && styles.inputError]}
        onPress={() => setVisible(true)}>
        <Text
          style={
            value ? styles.dropdownSelectedText : styles.dropdownPlaceholderText
          }>
          {value
            ? options.find(opt => opt.value === value)?.label
            : placeholder}
        </Text>
        <Icon name="chevron-down" size={20} color="#667085" />
      </TouchableOpacity>

      {touched && error && <Text style={styles.errorText}>{error}</Text>}

      <SelectionModal
        visible={visible}
        setVisible={setVisible}
        title={placeholder}
        options={options}
        selectedValue={value}
        onSelect={value => {
          onChange(value);
          setVisible(false);
        }}
      />
    </>
  );
};

export const CustomDateField = ({
  value,
  onChange,
  label,
  error,
  touched,
  formatDate,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

  let DatePicker = null;
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    DatePicker = require('@react-native-community/datetimepicker').default;
  }

  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.dateButton, touched && error && styles.inputError]}
        onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateButtonText}>{formatDate(value)}</Text>
        <Icon name="calendar" size={20} color="#667085" />
      </TouchableOpacity>
      {touched && error && <Text style={styles.errorText}>{error}</Text>}

      {Platform.OS === 'android' && showDatePicker && (
        <DatePicker
          value={value}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              onChange(selectedDate);
            }
          }}
        />
      )}

      {Platform.OS === 'ios' && (
        <DatePickerModal
          visible={showDatePicker}
          setVisible={setShowDatePicker}
          date={value}
          onDateChange={onChange}
        />
      )}
    </>
  );
};

export const SelectionModal = ({
  visible,
  setVisible,
  title,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>{title}</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Icon name="close" size={24} color="#101828" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={options}
            keyExtractor={item => item.value}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.optionItem}
                onPress={() => onSelect(item.value)}>
                <Text
                  style={[
                    styles.optionText,
                    selectedValue === item.value && styles.selectedOptionText,
                  ]}>
                  {item.label}
                </Text>
                {selectedValue === item.value && (
                  <Icon name="check" size={20} color="#5E72E4" />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </View>
    </Modal>
  );
};

export const DatePickerModal = ({visible, setVisible, date, onDateChange}) => {
  const [tempDate, setTempDate] = useState(date);

  const DatePicker = require('@react-native-community/datetimepicker').default;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setVisible(false)}>
      <View style={styles.modalOverlay}>
        <View style={styles.datePickerContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderText}>Select Date</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Icon name="close" size={24} color="#101828" />
            </TouchableOpacity>
          </View>

          <View style={styles.iosDatePickerContainer}>
            <DatePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={(event, date) => setTempDate(date || tempDate)}
              style={styles.datePicker}
            />
          </View>

          <View style={styles.datePickerActions}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setVisible(false)}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => {
                onDateChange(tempDate);
                setVisible(false);
              }}>
              <Text style={styles.confirmButtonText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#344054',
    marginBottom: 8,
  },
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  dropdownSelectedText: {
    fontSize: 16,
    color: '#101828',
  },
  dropdownPlaceholderText: {
    fontSize: 16,
    color: '#98A2B3',
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E4E7EC',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 1,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#101828',
  },
  inputError: {
    borderColor: '#F97066',
    borderWidth: 1.5,
  },
  errorText: {
    color: '#F97066',
    fontSize: 12,
    marginTop: 6,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
    maxHeight: '60%',
  },
  datePickerContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F4F7',
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#101828',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  optionText: {
    fontSize: 16,
    color: '#344054',
  },
  selectedOptionText: {
    color: '#5E72E4',
    fontWeight: '600',
  },
  separator: {
    height: 1,
    backgroundColor: '#F2F4F7',
  },
  iosDatePickerContainer: {
    backgroundColor: '#fff',
    padding: 16,
  },
  datePicker: {
    backgroundColor: '#fff',
    height: 200,
    width: '100%',
  },
  datePickerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F4F7',
  },
  cancelButton: {
    padding: 12,
    marginRight: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    color: '#667085',
    fontWeight: '500',
  },
  confirmButton: {
    padding: 12,
    backgroundColor: '#5E72E4',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
});
