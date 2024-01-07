import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

const Profile = ({ route }) => {
  const { userId } = route.params;
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserInfo(userData);
        } else {
          console.warn('User document not found');
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, [userId]);

  return (
    <View style={[styles.container, { backgroundColor: 'rgb(250,248,218)' }]}>
      <View style={[styles.headingContainer, { backgroundColor: 'rgb(250,248,218)' }]}>
        <Text style={styles.heading}>Kullanıcı Bilgilerim</Text>
      </View>

      {userInfo ? (
        <View style={[styles.userInfoContainer, { backgroundColor: 'rgb(250,248,218)' }]}>
          <View style={[styles.tableContainer, { width: Dimensions.get('window').width * 0.5 }]}>
            <View style={[styles.rowContainer, { backgroundColor: 'rgba(255,205,66, 0.5)' }]}>
              <Text style={[styles.tableHeader, { color: 'black' }]}>TC No:</Text>
              <Text style={styles.userInfoText}>{userInfo.tcNo}</Text>
            </View>
            <View style={[styles.rowContainer, { backgroundColor: 'rgb(250,248,218)' }]}>
              <Text style={[styles.tableHeader, { color: 'black' }]}>Email:</Text>
              <Text style={styles.userInfoText}>{userInfo.email}</Text>
            </View>
            <View style={[styles.rowContainer, { backgroundColor: 'rgba(255,205,66, 0.5)' }]}>
              <Text style={[styles.tableHeader, { color: 'black' }]}>First Name:</Text>
              <Text style={styles.userInfoText}>{userInfo.firstName}</Text>
            </View>
            <View style={[styles.rowContainer, { backgroundColor: 'rgb(250,248,218)' }]}>
              <Text style={[styles.tableHeader, { color: 'black' }]}>Last Name:</Text>
              <Text style={styles.userInfoText}>{userInfo.lastName}</Text>
            </View>
            <View style={[styles.rowContainer, { backgroundColor: 'rgba(255,205,66, 0.5)' }]}>
              <Text style={[styles.tableHeader, { color: 'black' }]}>Gender:</Text>
              <Text style={styles.userInfoText}>{userInfo.gender}</Text>
            </View>
            <View style={[styles.rowContainer, { backgroundColor: 'rgb(250,248,218)' }]}>
              <Text style={[styles.tableHeader, { color: 'black' }]}>Age:</Text>
              <Text style={styles.userInfoText}>{userInfo.age}</Text>
            </View>
            <View style={[styles.rowContainer, { backgroundColor: 'rgba(255,205,66, 0.5)' }]}>
              <Text style={[styles.tableHeader, { color: 'black' }]}>Password:</Text>
              <Text style={styles.userInfoText}>{userInfo.password}</Text>
            </View>
          </View>
        </View>
      ) : (
        <Text>Kullanıcı bilgileri yükleniyor...</Text>
      )}
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
  headingContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  userInfoContainer: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: 'lightgrey', // Açık gri kenarlık rengi
    borderRadius: 8,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey', // Açık gri kenarlık rengi
  },
  tableHeader: {
    fontWeight: 'bold',
  },
  userInfoText: {
    flex: 1,
    marginLeft: 10,
    color: 'black',
  },
});

export default Profile;
