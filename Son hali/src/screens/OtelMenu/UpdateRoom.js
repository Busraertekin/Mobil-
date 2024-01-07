import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Picker } from '@react-native-picker/picker';

const UpdateRoom = () => {
  const [selectedRoomType, setSelectedRoomType] = useState('A');
  const [selectedRoomNumber, setSelectedRoomNumber] = useState('');
  const [roomTypes, setRoomTypes] = useState(['A', 'B']);
  const [roomNumbers, setRoomNumbers] = useState([]);
  const [currentRoomInfo, setCurrentRoomInfo] = useState({
    odaNo: '',
    ucret: '',
    '1': '',
    '2': '',
    '3': '',
  });

  useEffect(() => {
    // Oda tipine ait oda numaralarını getir
    const fetchRoomNumbers = async () => {
      try {
        const roomsCollection = collection(db, selectedRoomType);
        const roomSnapshot = await getDocs(roomsCollection);

        // Oda numarasına ait bilgileri al
        const roomNumbersData = roomSnapshot.docs.map((doc) => doc.data().odaNo);
        setRoomNumbers(roomNumbersData);
      } catch (error) {
        console.error('Oda numaraları getirilirken hata:', error);
      }
    };

    fetchRoomNumbers();
  }, [selectedRoomType]);

  useEffect(() => {
    // Seçilen koleksiyon, oda tipi ve oda numarasına ait bilgileri getir
    const fetchRoomInfo = async () => {
      try {
        const roomsCollection = collection(db, selectedRoomType);
        const roomQuery = query(roomsCollection, where('odaNo', '==', selectedRoomNumber));
        const roomSnapshot = await getDocs(roomQuery);

        if (!roomSnapshot.empty) {
          const roomData = roomSnapshot.docs[0].data();
          setCurrentRoomInfo(roomData);
        } else {
          // Eğer oda bulunamazsa, kullanıcıyı uyar
          Alert.alert('Uyarı', 'Belirtilen oda numarasına ait bilgi bulunamadı.');
        }
      } catch (error) {
        console.error('Bilgi getirilirken hata:', error);
        Alert.alert('Hata', 'Bilgi getirilirken bir hata oluştu.');
      }
    };

    if (selectedRoomNumber) {
      fetchRoomInfo();
    }
  }, [selectedRoomType, selectedRoomNumber]);

  const handleUpdateRoom = async () => {
    try {
      // Belirtilen koleksiyon, oda tipi ve oda numarasına ait dokümanı güncelle
      const roomsCollection = collection(db, selectedRoomType);
      const roomQuery = query(roomsCollection, where('odaNo', '==', selectedRoomNumber));
      const roomSnapshot = await getDocs(roomQuery);
      const roomDoc = roomSnapshot.docs[0];

      if (roomDoc) {
        await updateDoc(roomDoc.ref, {
          ucret: currentRoomInfo.ucret,
          '1': currentRoomInfo['1'],
          '2': currentRoomInfo['2'],
          '3': currentRoomInfo['3'],
        });

        Alert.alert('Başarılı', 'Oda bilgileri güncellendi.');
      } else {
        // Eğer oda bulunamazsa, kullanıcıyı uyar
        Alert.alert('Uyarı', 'Belirtilen oda numarasına ait bilgi bulunamadı.');
      }
    } catch (error) {
      console.error('Oda güncellenirken hata:', error);
      Alert.alert('Hata', 'Oda bilgileri güncellenirken bir hata oluştu.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: 'rgb(250,248,218)' }]}>
      <Text style={styles.heading}>Oda Güncelle</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Oda Tipi Seç:</Text>
        <Picker
          selectedValue={selectedRoomType}
          onValueChange={(itemValue) => setSelectedRoomType(itemValue)}
          style={styles.picker}
        >
          {roomTypes.map((type) => (
            <Picker.Item key={type} label={type} value={type} />
          ))}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Oda Numarası Seç:</Text>
        <Picker
          selectedValue={selectedRoomNumber}
          onValueChange={(itemValue) => setSelectedRoomNumber(itemValue)}
          style={styles.picker}
        >
          {roomNumbers.map((number) => (
            <Picker.Item key={number} label={number} value={number} />
          ))}
        </Picker>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Oda Numarası:</Text>
        <TextInput style={styles.input} value={currentRoomInfo.odaNo} editable={false} />
        <Text style={styles.label}>Ücret:</Text>
        <TextInput
          style={styles.input}
          value={currentRoomInfo.ucret}
          onChangeText={(text) => setCurrentRoomInfo({ ...currentRoomInfo, ucret: text })}
        />
        <Text style={styles.label}>1. Özellik:</Text>
        <TextInput
          style={styles.input}
          value={currentRoomInfo['1']}
          onChangeText={(text) => setCurrentRoomInfo({ ...currentRoomInfo, '1': text })}
        />
        <Text style={styles.label}>2. Özellik:</Text>
        <TextInput
          style={styles.input}
          value={currentRoomInfo['2']}
          onChangeText={(text) => setCurrentRoomInfo({ ...currentRoomInfo, '2': text })}
        />
        <Text style={styles.label}>3. Özellik:</Text>
        <TextInput
          style={styles.input}
          value={currentRoomInfo['3']}
          onChangeText={(text) => setCurrentRoomInfo({ ...currentRoomInfo, '3': text })}
        />
      </View>

      <Button title="Güncelle" onPress={handleUpdateRoom} color="rgb(255,205,66)" />
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
    marginBottom: 20,
    width: '80%',
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
  picker: {
    height: 40,
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default UpdateRoom;
