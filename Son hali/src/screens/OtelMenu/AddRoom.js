import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Picker } from '@react-native-picker/picker';

export default function AddRoom({ navigation }) {
  const [selectedRoomType, setSelectedRoomType] = useState('A');
  const [odaNo, setOdaNo] = useState('');
  const [ucret, setUcret] = useState('');
  const [ozellik1, setOzellik1] = useState('');
  const [ozellik2, setOzellik2] = useState('');
  const [ozellik3, setOzellik3] = useState('');

  const handleAddRoom = async () => {
    try {
      const roomExistsQuery = query(collection(db, selectedRoomType), where('odaNo', '==', odaNo));
      const existingRoomsSnapshot = await getDocs(roomExistsQuery);

      if (!existingRoomsSnapshot.empty) {
        Alert.alert('Uyarı', 'Bu oda numarası zaten mevcut. Lütfen farklı bir oda numarası deneyin.');
        return;
      }

      const roomsCollection = collection(db, selectedRoomType);
      await addDoc(roomsCollection, {
        odaNo,
        ucret,
        '1': ozellik1,
        '2': ozellik2,
        '3': ozellik3,
      });

      Alert.alert('Başarılı', 'Yeni oda eklendi.');

    } catch (error) {
      console.error('Oda eklenirken hata oluştu:', error);
      Alert.alert('Hata', 'Oda eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: 'rgb(250,248,218)' }]}>
      <Text style={styles.heading}>Oda Ekle</Text>
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Oda Tipi Seç:</Text>
        <Picker
          selectedValue={selectedRoomType}
          onValueChange={(itemValue) => setSelectedRoomType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Aaaaaaaaa" value="A" style={styles.pickerItem} />
          <Picker.Item label="Bbbbbbbbbbb" value="B" style={styles.pickerItem} />
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Oda No:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setOdaNo(text)}
        />

        <Text style={styles.label}>Ücret:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setUcret(text)}
        />

        <Text style={styles.label}>Özellik 1:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setOzellik1(text)}
        />

        <Text style={styles.label}>Özellik 2:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setOzellik2(text)}
        />

        <Text style={styles.label}>Özellik 3:</Text>
        <TextInput
          style={styles.input}
          onChangeText={(text) => setOzellik3(text)}
        />
      </View>

      <Button
        title="Oda Ekle"
        onPress={handleAddRoom}
        color="rgb(255,205,66)"
      />
    </View>
  );
}

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
    marginBottom: 20,
    width: '80%',
  },
  picker: {
    height: 40,
    width: '100%',
    borderWidth: 2,
    borderColor: 'rgb(255,205,66)',
    borderRadius: 5,
    marginBottom: 20,
  },
  pickerItem: {
    borderWidth: 2,
    borderColor: 'rgb(255,205,66)',
    borderRadius: 5,
    marginBottom: 10,
    padding: 8,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});
