import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import React from 'react';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useTestQueries from '../../queries/TestQueries/testQueries';
import LinearGradient from 'react-native-linear-gradient';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import SecondryHeader from '../../components/Headers/SecondryHeader';
import Loading from '../../components/Loading/Loading';

const TestScreen = ({navigation}: any) => {
  const {data, isPending} = useTestQueries();
  return (
    <View style={{flex: 1}}>
      <SecondryHeader
        title={'Devices'}
        showBack={true}
        rightButtonIcon={'add'}
        rightButtonAction={() => navigation.navigate('AddTest')}
      />
      <FlatList
        data={data}
        style={{flex: 1}}
        ListEmptyComponent={() => <Loading />}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity
            style={styles.cardContainer}
            activeOpacity={0.9}
            onPress={() => navigation.navigate('TestDetails', {id: item?.id})}>
            <View style={styles.header}>
              <Text style={styles.deviceName}>{item.name}</Text>
              {item?.data?.price && (
                <View style={styles.priceTag}>
                  <Text style={styles.priceText}>${item?.data?.price}</Text>
                </View>
              )}
            </View>

            <View style={styles.infoContainer}>
              <View style={styles.infoItem}>
                <MaterialIcons
                  name="calendar-today"
                  size={20}
                  color="#5B5B5B"
                />
                <Text style={styles.infoLabel}>Year</Text>
                <Text style={styles.infoValue}>{item?.data?.year}</Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <MaterialIcons name="memory" size={20} color="#5B5B5B" />
                <Text style={styles.infoLabel}>CPU</Text>
                <Text style={styles.infoValue}>
                  {item?.data?.['CPU model']}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.infoItem}>
                <MaterialIcons name="storage" size={20} color="#5B5B5B" />
                <Text style={styles.infoLabel}>Storage</Text>
                <Text style={styles.infoValue}>{item?.capacity}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    flexShrink: 1,
  },
  priceTag: {
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    color: '#007AFF',
    fontWeight: '600',
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoItem: {
    flex: 1,
    alignItems: 'center',
  },
  infoLabel: {
    color: '#5B5B5B',
    fontSize: 12,
    marginTop: 4,
  },
  infoValue: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#EEEEEE',
  },
});
export default TestScreen;
