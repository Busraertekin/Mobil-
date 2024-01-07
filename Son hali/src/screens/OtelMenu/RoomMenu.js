import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const RoomMenu = ({ route, navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Otel Menüsü</Text>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("AddRoom")}>
        <Text style={styles.menuText}>Oda Ekle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("UpdateRoom")}>
        <Text style={styles.menuText}>Oda Güncelle</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("ListRoom")}>
        <Text style={styles.menuText}>Odaları Listele</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(250,248,218)', // Açık sarı renk
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: 'black', // Siyah renk
  },
  menuItem: {
    borderColor: 'gold', // Sarı renk
    borderWidth: 1,
    padding: 12,
    marginBottom: 16,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgb(255,205,66)', // Sarı renk
    width: '80%', // Buton genişliği
  },
  menuText: {
    fontSize: 18,
    color: 'black', // Siyah renk
  },
});

export default RoomMenu;
