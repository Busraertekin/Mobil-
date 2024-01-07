import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, StyleSheet, Alert } from 'react-native';
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from '../../../firebase';
import { useNavigation } from '@react-navigation/native';

export default function Login({}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Uyarı', 'E-posta veya şifre boş bırakılamaz.');
      return;
    }

    const usersCollection = query(
      collection(db, 'users'),
      where('email', '==', email),
      where('password', '==', password)
    );

    try {
      const querySnapshot = await getDocs(usersCollection);

      if (!querySnapshot.empty) {
        console.log('Giriş başarılı!');
        const userId = querySnapshot.docs[0].id;
        navigation.navigate('Menu', { userId })
      } else {
        console.log('Kullanıcı bulunamadı veya şifre hatalı.');
        Alert.alert('Kullanıcı bulunamadı veya şifre hatalı.');
      }
    } catch (error) {
      console.error('Giriş sırasında bir hata oluştu:', error);
    }
  };

  return (
    <ImageBackground source={require('../../../assets/saripalmiye.jpg')} style={styles.background}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <View style={styles.card}>
            <TextInput
              style={[styles.input, { height: 50, width: 300 }]}
              placeholder="E-posta"
              onChangeText={(text) => setEmail(text)}
            />
          </View>
          <View style={styles.card}>
            <TextInput
              style={[styles.input, { height: 55, width: 300 }]}
              placeholder="Şifre"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Giriş Yap</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.kaydolunButton} onPress={() => navigation.navigate("Register")}>
              <Text style={styles.buttonText}>Kaydolun</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 3,
    paddingLeft: 10,
    borderRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: 'rgb(255,205,66)',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  kaydolunButton: {
    backgroundColor: 'rgb(250,248,180)',
    padding: 10,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
  },
  registerText: {
    marginTop: 20,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  formContainer: {
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 15,
    marginBottom: 10,
    padding: 10,
    width: '100%',
    alignSelf: 'center',
  },
});

