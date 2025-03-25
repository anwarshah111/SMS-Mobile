import {useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import SecondryHeader from '../../components/Headers/SecondryHeader';
import {useAddTestDetails} from '../../queries/TestQueries/testQueries';
import {useQueryClient} from '@tanstack/react-query';

// Interface for Product
interface Product {
  name: string;
  price: number;
  model: string;
}

const AddTests: React.FC = ({navigation}) => {
  const mutation = useAddTestDetails();
  const queryClient = useQueryClient();

  const [product, setProduct] = useState<Product>({
    name: '',
    price: 0,
    model: 'Standard',
  });

  const handleSubmit = async () => {
    mutation.mutate(
      {
        name: product?.name,
        data: {
          year: product?.model,
          price: product?.price,
          'CPU model': 'Intel Core i9',
          'Hard disk size': '1 TB',
          color: 'silver',
        },
      },
      {
        onSuccess: () => {
          console.log('ON Add');

          queryClient.invalidateQueries({queryKey: ['test-data']});
          navigation.goBack();
        },
      },
    );
  };

  return (
    <View style={styles.container}>
      <SecondryHeader title={'Add Device'} showBack={true} />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">
        {/* <Text style={styles.title}>Edit Product</Text> */}

        <View style={styles.formContainer}>
          {/* Title Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={product.name}
              onChangeText={text => setProduct({...product, name: text})}
              placeholder="Enter product title"
            />
          </View>

          {/* Price Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={product.price?.toString()}
              onChangeText={text =>
                setProduct({...product, price: parseFloat(text)})
              }
              keyboardType="numeric"
              placeholder="Enter product price"
            />
          </View>

          {/* Model Input */}
          {/* <View style={styles.inputGroup}>
            <Text style={styles.label}>Model</Text>
            <TextInput
              style={styles.input}
              value={product.model}
              onChangeText={text => setProduct({...product, model: text})}
              placeholder="Enter product model"
            />
          </View> */}

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Update Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTests;
