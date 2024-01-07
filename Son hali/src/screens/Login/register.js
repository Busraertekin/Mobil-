import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db } from '../../../firebase';
import { Picker } from '@react-native-picker/picker';

export default function Register({ navigation }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!password || !tcNo || !email) {
      alert('TC, Şifre ve email boş bırakılamaz.');
      return;
    }
    const usersCollection = collection(db, 'users');

    const userQuery = query(usersCollection, where('tcNo', '==', tcNo), where('email', '==', email));

    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      alert('Bu TC No ve email zaten kullanılmaktadır.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Şifreler uyuşmuyor.');
      return;
    }

    try {
      await addDoc(usersCollection, {
        tcNo: tcNo,
        email: email,
        firstName: firstName,
        lastName: lastName,
        age: age,
        password: password,
        identity: 'user',
      });
      Alert.alert('Başarılı', 'Kullanıcı kaydınız başarıyla tamamlandı.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Kayıt sırasında bir hata oluştu:', error);
      alert('Kayıt sırasında bir hata oluştu.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: 'rgb(250,248,218)' }]}>
      <Text style={styles.heading}>Kayıt Ol</Text>

      <TextInput
        style={styles.input}
        placeholder="Ad"
        onChangeText={(text) => setFirstName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Soyad"
        onChangeText={(text) => setLastName(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Yaş"
        onChangeText={(text) => setAge(text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="TC No"
        onChangeText={(text) => setTcNo(text)}
        keyboardType="numeric"
      />

      <TextInput
        style={styles.input}
        placeholder="E-posta"
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Şifre"
        secureTextEntry
        onChangeText={(text) => setPassword(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="Şifreyi Doğrula"
        secureTextEntry
        onChangeText={(text) => setConfirmPassword(text)}
      />

      <TouchableOpacity style={[styles.button, { backgroundColor: 'rgb(255,205,66)' }]} onPress={handleRegister}>
        <Text style={[styles.buttonText, { color: 'black' }]}>Kayıt Ol</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={[styles.loginText, { color: 'rgb(255,205,66)', fontWeight: 'bold', fontSize: 16 }]}>
          Buraya basarak giriş yapın.
        </Text>
      </TouchableOpacity>
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
  input: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    borderRadius: 20,
  },
  picker: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'rgb(255,205,66)',
    padding: 10,
    borderRadius: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  loginText: {
    marginTop: 20,
    color: 'rgb(255,205,66)',
    textDecorationLine: 'underline',
  },
});
