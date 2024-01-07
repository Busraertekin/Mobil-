import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { collection, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../../firebase';

const ListRoom = () => {
  // State to manage the selected room type (A or B)
  const [selectedOption, setSelectedOption] = useState('A');

  // State to store the list of rooms fetched from the Firestore database
  const [rooms, setRooms] = useState([]);

  // Function to fetch rooms based on the selected room type
  const fetchRooms = async () => {
    try {
      const roomsCollection = collection(db, selectedOption === 'A' ? 'A' : 'B');
      const querySnapshot = await getDocs(roomsCollection);
      const roomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsData);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  // useEffect hook to fetch rooms when the component mounts or when the selected room type changes
  useEffect(() => {
    fetchRooms();
  }, [selectedOption]);

  // Function to handle the deletion of a room
  const handleDeleteRoom = async (roomId) => {
    try {
      // Firestore: Delete a document with the given ID
      await deleteDoc(doc(db, selectedOption === 'A' ? 'A' : 'B', roomId));

      // Update the list by removing the deleted room
      setRooms(prevRooms => prevRooms.filter(room => room.id !== roomId));
    } catch (error) {
      console.error('Error deleting room:', error);
      Alert.alert('Error', 'An error occurred while deleting the room. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: 'rgb(250,248,218)' }]}>
      <Text style={styles.heading}>Oda Stili Seçiniz</Text>

      {/* Picker to select room type (A or B) */}
      <Picker
        selectedValue={selectedOption}
        onValueChange={(itemValue) => setSelectedOption(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="A" value="A" />
        <Picker.Item label="B" value="B" />
      </Picker>

      {/* FlatList to display the list of rooms */}
      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.roomItem}>
            <Text>Oda No: {item.odaNo}</Text>
            <Text>Ücret: {item.ucret}</Text>
            <Text>1: {item['1']}</Text>
            <Text>2: {item['2']}</Text>
            <Text>3: {item['3']}</Text>

            {/* TouchableOpacity for the "Sil" (Delete) button */}
            <TouchableOpacity onPress={() => handleDeleteRoom(item.id)}>
              <Text style={styles.deleteButton}>Sil</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  roomItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
    marginLeft: 10,
  },
});

export default ListRoom;
