// SchoolRequestScreen.jsx
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import useFetchSchools, { useUpdateSchoolStatus } from '../../queries/AdminQueries/adminQueries';

const SchoolRequestScreen = () => {
  const [refreshing, setRefreshing] = useState(false);
  const {data, status, isPending, refetch} = useFetchSchools();
  const mutation = useUpdateSchoolStatus();

  const [schools, setSchools] = useState(data || []);

  useEffect(() => {
    if (data?.length) {
      setSchools(data);
    }
  }, [data]);

  const handleRefresh = () => {
    setRefreshing(true);
    refetch().finally(() => setRefreshing(false));
  };

  const handleAccept = id => {
    mutation.mutate({id: id, data: {status: 'A'}});
    setSchools(
      schools.map(school =>
        school._id === id ? {...school, status: 'A'} : school,
      ),
    );

    // Here you would make an API call to update the status
    console.log(`School ${id} accepted`);
  };

  const handleReject = id => {
    mutation.mutate({id: id, data: {status: 'R'}});
    setSchools(
      schools.map(school =>
        school._id === id ? {...school, status: 'R'} : school,
      ),
    );
    // Here you would make an API call to update the status
    console.log(`School ${id} rejected`);
  };

  const formatDate = dateString => {
    const options = {year: 'numeric', month: 'short', day: 'numeric'};
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderSchoolCard = ({item}) => (
    // <Shadow distance={5} startColor={'#00000010'} offset={[0, 3]}>
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={{uri: item.logo}} style={styles.logo} />
        <View style={styles.schoolInfo}>
          <Text style={styles.schoolName}>{item.name}</Text>
          <Text style={styles.location}>{item.address}</Text>
          <Text style={styles.date}>
            Request received: {formatDate(item.requestAt)}
          </Text>
        </View>
      </View>

      {item.status === 'P' ? (
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleReject(item._id)}>
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.acceptButton]}
            onPress={() => handleAccept(item._id)}>
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.statusContainer}>
          <Text
            style={[
              styles.statusText,
              item.status === 'A'
                ? styles.statusAccepted
                : styles.statusRejected,
            ]}>
            {item.status === 'A' ? 'Accepted' : 'Rejected'}
          </Text>
        </View>
      )}
    </View>
    // </Shadow>
  );

  if (status === 'pending') {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Loading school requests...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      <View style={styles.header}>
        <Text style={styles.title}>School Requests</Text>
        <Text style={styles.subtitle}>
          {schools.filter(s => s.status === 'P').length} pending requests
        </Text>
      </View>
      <FlatList
        data={schools}
        renderItem={renderSchoolCard}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No school requests found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 4,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3,
    shadowOpacity: 0.2,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e1e4e8',
  },
  schoolInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  location: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  rejectButton: {
    backgroundColor: '#ffebee',
    borderWidth: 1,
    borderColor: '#f44336',
  },
  acceptText: {
    color: '#2e7d32',
    fontWeight: '600',
  },
  rejectText: {
    color: '#c62828',
    fontWeight: '600',
  },
  statusContainer: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  statusText: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
    fontWeight: '600',
  },
  statusAccepted: {
    backgroundColor: '#e8f5e9',
    color: '#2e7d32',
  },
  statusRejected: {
    backgroundColor: '#ffebee',
    color: '#c62828',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#95a5a6',
  },
});

export default SchoolRequestScreen;
