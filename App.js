import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useFonts, SpaceGrotesk_300Light, SpaceGrotesk_700Bold } from '@expo-google-fonts/space-grotesk';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Audio } from 'expo-av';

import Produto from './src/telas/Produto';
import mock from './src/mocks/produto';
import Sobre from './src/telas/Sobre';
import mock_sobre from './src/mocks/sobre';
import Cardapio from './src/telas/Cardapio';
import mock_cardapio from './src/mocks/cardapio';
import Perfil from './src/telas/Perfil/perfil'; // Certifique-se de que o caminho está correto
import Texto from './src/componentes/Texto';

function MenuPromocao() {
  return <Produto {...mock} />;
}

function MenuSobre() {
  return <Sobre {...mock_sobre} />;
}

function MenuCardapio() {
  return <Cardapio {...mock_cardapio} />;
}

function MenuPerfil() {
  return <Perfil />;
}

function MenuAudio() {
  const [audioStatus, setAudioStatus] = useState(false);
  const [sound, setSound] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (audioStatus) {
        setLoading(true);
        const { sound } = await Audio.Sound.createAsync(
          require('./assets/musica.mp3') // Corrija o nome do arquivo se necessário
        );
        setSound(sound);
        try {
          await sound.playAsync();
        } catch (e) {
          console.log(e);
        }
        setLoading(false);
      } else {
        if (sound) {
          try {
            await sound.stopAsync();
            await sound.unloadAsync();
          } catch (e) {
            console.log(e);
          }
        }
      }
    })();
  }, [audioStatus]);

  return (
    <TouchableOpacity onPress={() => { if (!loading) { setAudioStatus(prevStatus => !prevStatus); } }}>
      <Texto>ON/OFF</Texto>
    </TouchableOpacity>
  );
}

const Tab = createBottomTabNavigator();

function TabsMenu() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Sobre nós') {
            iconName = focused ? 'star' : 'star-outline';
          } else if (route.name === 'Promoções') {
            iconName = focused ? 'square' : 'square-outline';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Lista de Desejos') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
        tabBarHideOnKeyboard: true,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Sobre nós" component={MenuSobre} />
      <Tab.Screen name="Promoções" component={MenuPromocao} />
      <Tab.Screen name="Menu" component={MenuCardapio} />
      <Tab.Screen name="Lista de Desejos" component={MenuSobre} options={{ tabBarBadge: 3 }} />
      <Tab.Screen name="Perfil" component={MenuPerfil} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [fonteCarregada] = useFonts({
    "SpaceGRegular": SpaceGrotesk_300Light,
    "SpaceGBold": SpaceGrotesk_700Bold,
  });

  if (!fonteCarregada) {
    return <View />;
  }

  return (
    <NavigationContainer>
      <TabsMenu />
      <MenuAudio/>
    </NavigationContainer>
  );
}
