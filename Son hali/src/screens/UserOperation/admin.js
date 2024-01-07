import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../../firebase';

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const querySnapshot = await getDocs(usersCollection);
        const usersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId));
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      Alert.alert('Success', 'User has been deleted successfully.');
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'An error occurred while deleting the user. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kullanıcılar</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleDeleteUser(item.id)}>
            <View style={styles.userContainer}>
              <Text>TC No: {item.tcNo}</Text>
              <Text>Email: {item.email}</Text>
              {/* Add other user information as needed */}
              <Text style={styles.deleteText}>Delete</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgb(250,248,218)',
    flex: 1,
    paddingTop: 30, // Adjusted padding top for better positioning
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10, // Adjusted margin vertical
  },
  userContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  deleteText: {
    color: 'red',
  },
});

export default Admin;
