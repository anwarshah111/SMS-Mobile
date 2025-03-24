import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React from 'react';
import SecondryHeader from '../../components/Headers/SecondryHeader';
import {useRoute} from '@react-navigation/native';
import {useTestDetailsQuery} from '../../queries/TestQueries/testQueries';
import Loading from '../../components/Loading/Loading';

const TestDetails = () => {
  const routes = useRoute();
  const {id} = routes.params;

  const {data, status} = useTestDetailsQuery(id);

  return (
    <View style={{flex: 1}}>
      <SecondryHeader
        title={'Details'}
        rightButtonAction={() => {}}
        rightButtonIcon={'edit'}
      />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {status === 'pending' ? (
          <Loading />
        ) : (
          <View style={styles.card}>
            <Text style={styles.modelLabel}>Model</Text>
            <Text style={styles.modelNumber}>{data?.name}</Text>

            <View style={styles.divider} />

            <Text style={styles.productName}>{data?.name}</Text>

            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.price}>${data?.data?.price}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f7',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modelLabel: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  modelNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 24,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceLabel: {
    fontSize: 16,
    color: '#666',
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2c6e49',
  },
});

export default TestDetails;
