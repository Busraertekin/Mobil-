import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React from 'react';

export default function CoursesScreen({navigation}) {
  const courses = [
    { name: 'Angular', id: 1 },
    { name: 'React Js', id: 2 },
    { name: 'C#', id: 3 },
    { name: 'C Programlama', id: 4 },
    { name: 'Bootstrap', id: 5 },
  ];
  const handleCoursePress = (id, name) => {
    // Başka bir sayfaya yönlendirme yap
    navigation.navigate(name, { courseId: id });
  };
  return (
    <FlatList
    data={courses}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => {
      return (
        <TouchableOpacity onPress={() => handleCoursePress(item.id, item.name)}>
          <Text style={styles.content}>{item.name}</Text>
        </TouchableOpacity>
      );
    }}
  />
  );
}

const styles = StyleSheet.create({
  content: {
    fontSize: 20,
    backgroundColor: 'yellow',
    marginVertical: 10,
    padding: 20,
  },
});
