import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import { collection, getDocs, setDoc, query, where } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';
import { db } from '../../../firebase';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const Reservation = ({ route }) => {
  const userId = route.params.userId;

  const [selectedOption, setSelectedOption] = useState('');
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [rooms, setRooms] = useState([]);

  const fetchRooms = async () => {
    try {
      const roomsCollection = collection(db, selectedOption === 'A' ? 'A' : 'B');
      const querySnapshot = await getDocs(roomsCollection);
      const roomsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(roomsData);
    } catch (error) {
      console.error('Odalari getirirken hata olustu:', error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [selectedOption]);

  const handleRoomSelection = (roomNumber, key) => {
    const isRoomSelected = selectedRooms.some(room => room.roomNumber === roomNumber && room.key === key);

    if (isRoomSelected) {
      setSelectedRooms(prevSelectedRooms => prevSelectedRooms.filter(room => !(room.roomNumber === roomNumber && room.key === key)));
    } else {
      setSelectedRooms(prevSelectedRooms => [...prevSelectedRooms, { roomNumber, key }]);
    }
  };

  async function orderNotification() {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Başarılı",
        body: 'Rezervasyon işleminiz gerçekleşmiştir.',
        data: { data: 'buraya yazabilirsiniz' },
      },
      trigger: { seconds: 2 },
    });
  }

  const handleReservation = async () => {
    try {
      if (!selectedOption || selectedOption !== 'A' && selectedOption !== 'B') {
        Alert.alert('Uyarı', 'Lütfen oda stili seçiniz.');
        return;
      }

      if (selectedRooms.length === 0) {
        Alert.alert('Uyarı', 'Lütfen bir oda seçimi yapınız.');
        return;
      }

      const updatedRooms = [];

      for (const { roomNumber, key } of selectedRooms) {
        const roomCollectionRef = collection(db, selectedOption === 'A' ? 'A' : 'B');
        const roomQuerySnapshot = await getDocs(query(roomCollectionRef, where('odaNo', '==', roomNumber.toString())));

        if (!roomQuerySnapshot.empty) {
          const roomDoc = roomQuerySnapshot.docs[0];
          const roomData = roomDoc.data();

          if (roomData && (roomData[key] === null || roomData[key] === '')) {
            await setDoc(roomDoc.ref, { [key]: userId }, { merge: true });
            updatedRooms.push({ roomNumber, key });
          } else {
            Alert.alert('Bilgi', `Bu oda ${roomNumber} numarası için zaten rezerve edilmiş. Lütfen başka bir oda seçin.`);
          }
        } else {
          Alert.alert('Hata', 'Oda bulunamadı.');
        }
      }

      if (updatedRooms.length > 0) {
        Alert.alert('Başarılı', 'Rezervasyon başarıyla yapıldı.');
        await fetchRooms();
        setSelectedRooms([]); // Seçilen odaları sıfırla
        await orderNotification();
      }
    } catch (error) {
      //console.error('Oda rezervasyonu işlenirken hata olustu:', error);
      //Alert.alert('Hata', `Oda rezervasyonu işlenirken hata oluştu: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Oda Seçimi </Text>

      <Picker
        selectedValue={selectedOption}
        onValueChange={(itemValue) => setSelectedOption(itemValue)}
        style={[styles.picker, selectedOption === 'A' ? styles.pickerOptionA : styles.pickerOptionB]}
        itemStyle={{ color: 'rgb(255, 205, 66)' }}
      >
        <Picker.Item label="Oda Stili Seçiniz" value="" />
        <Picker.Item label="A" value="A" />
        <Picker.Item label="B" value="B" />
      </Picker>

      <FlatList
        data={rooms}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.roomItem, selectedOption === 'A' ? styles.selectedList : null]}>
            <Text style={styles.roomNumber}>Oda No: {item.odaNo}</Text>
            <Text style={styles.roomDetail}>Ücret: {item.ucret}</Text>

            <TouchableOpacity onPress={() => handleRoomSelection(item.odaNo, '1')} style={selectedRooms.some(room => room.roomNumber === item.odaNo && room.key === '1') ? { backgroundColor: 'yellow' } : {}}>
              <Text style={styles.selectButton}>
                {item['1'] ? 'Rezerve Edildi' : 'Ayın 1. Günü için Seç'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRoomSelection(item.odaNo, '2')} style={selectedRooms.some(room => room.roomNumber === item.odaNo && room.key === '2') ? { backgroundColor: 'yellow' } : {}}>
              <Text style={styles.selectButton}>
                {item['2'] ? 'Rezerve Edildi' : 'Ayın 2. Günü için Seç'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRoomSelection(item.odaNo, '3')} style={selectedRooms.some(room => room.roomNumber === item.odaNo && room.key === '3') ? { backgroundColor: 'yellow' } : {}}>
              <Text style={styles.selectButton}>
                {item['3'] ? 'Rezerve Edildi' : 'Ayın 3.Günü için Seç'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleRoomSelection(item.odaNo, '4')} style={selectedRooms.some(room => room.roomNumber === item.odaNo && room.key === '4') ? { backgroundColor: 'yellow' } : {}}>
              <Text style={styles.selectButton}>
                {item['4'] ? 'Rezerve Edildi' : 'Ayın 4. günü için Seç'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <Button title="Rezervasyon Yap" onPress={handleReservation} color="rgb(255,205,66)" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgb(250,248,218)',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    height: 40,
    width: '100%',
  },
  pickerOptionA: {
    backgroundColor: 'rgba(255, 205, 66, 0.2)', // Option A için arka plan rengi
  },
  pickerOptionB: {
    backgroundColor: 'rgba(255, 205, 66, 0.2)', // Option B için arka plan rengi
  },
  roomItem: {
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: '#ccc',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  selectedList: {
    borderColor: 'rgb(255, 205, 66)',
    borderWidth: 2,
  },
  roomNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  roomDetail: {
    fontSize: 18,
    marginBottom: 5,
  },
  selectButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: 10,
  },
});

export default Reservation;
