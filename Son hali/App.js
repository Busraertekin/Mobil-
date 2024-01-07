import React,{useState,useEffect} from 'react';
import { NavigationContainer, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login/login';
import Register from './src/screens/Login/register';
import ListRoom from './src/screens/OtelMenu/ListRoom';
import AddRoom from './src/screens/OtelMenu/AddRoom';
import UpdateRoom from './src/screens/OtelMenu/UpdateRoom';
import RoomMenu from './src/screens/OtelMenu/RoomMenu';
import Profile from './src/screens/UserOperation/profile';
import Reservation from './src/screens/Reservation/Reservation';
import Admin from './src/screens/UserOperation/admin';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


const Menu = ({ route }) => {
  const userId = route.params?.userId;
  const [userIdentity, setUserIdentity] = useState(null);

  useEffect(() => {
    const fetchUserIdentity = async () => {
      try {
        const userDocRef = doc(db, 'users', userId);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          setUserIdentity(userData.identity);
        } else {
          console.warn('User document not found');
        }
      } catch (error) {
        console.error('Error fetching user identity:', error);
      }
    };

    fetchUserIdentity();
  }, [userId]);
  return (
      <Tab.Navigator initialRouteName="ReservationMenu" independent={true}>
        <Tab.Screen name="App" component={App} 
          options={{ headerShown: false,tabBarStyle: { display: 'none' },title:'Çıkış yap'}} />
          {userIdentity === 'admin' && (
          <Tab.Screen name="OtelMenu" component={OtelMenu} initialParams={route.params} options={{ headerShown: false ,title:'Otel Menüsü',tabBarOnPress: ({ navigation, defaultHandler }) => {
            navigation.navigate('RoomMenu');
            defaultHandler();
          },}}/>
          )}
        
        <Tab.Screen name="Profile" component={Profile} initialParams={route.params} 
          options={{ headerShown: false,title:'Profil'}} />

        {userIdentity === 'admin' && (
          

          <Tab.Screen
            name="Admin"
            component={Admin}
            initialParams={route.params}
            options={{ headerShown: false, title: 'Admin' }}
          />
        )}
          <Tab.Screen name="ReservationMenu" component={ReservationMenu} initialParams={route.params} 
          options={{ headerShown: false,title:'Reservasyon'}}/>
      </Tab.Navigator>
  );
};
const OtelMenu = () => (
  <Stack.Navigator initialRouteName="RoomMenu"  >
    <Stack.Screen name="RoomMenu" component={RoomMenu} options={{ headerShown: false }}/>
    <Stack.Screen name="AddRoom" component={AddRoom} options={{ title: 'Otel Menüsüne dön' ,}}/>
    <Stack.Screen name="UpdateRoom" component={UpdateRoom} options={{ title: 'Otel Menüsüne dön' ,}}/>
    <Stack.Screen name="ListRoom" component={ListRoom} options={{ title: 'Otel Menüsüne dön' ,}}/>
  </Stack.Navigator>
);
const ReservationMenu = ({route}) => (
  <Stack.Navigator initialRouteName="Reservation" >
    <Stack.Screen name="Reservation" component={Reservation} options={{ headerShown: false }} initialParams={route.params}/>
  </Stack.Navigator>
);

export default function App({ route, navigation }) {
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (route && route.params && route.params.userId && !isLoggedIn) {
      setLoggedIn(true);

      navigation.navigate('Menu', { userId: route.params.userId });
    }
  }, [route, isLoggedIn, navigation]);

  return (
    <NavigationContainer independent={true}>
    <Stack.Navigator initialRouteName="Login" >
    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
    <Stack.Screen name="Register" component={Register} options={{ headerShown: false }}/>
    <Stack.Screen name="Menu" component={Menu} options={{ headerShown: false }}/>
  </Stack.Navigator>
  </NavigationContainer>
  );
};
