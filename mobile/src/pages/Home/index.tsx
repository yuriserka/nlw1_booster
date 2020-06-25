import React, { useEffect, useState } from 'react';
import { View, Text, Image, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Select, { Item } from 'react-native-picker-select';
import { SafeAreaView } from 'react-native-safe-area-context';
import Axios from 'axios';
import styles, { selectStyle } from './styles';

const Home = () => {
  const navigation = useNavigation();

  const [ufs, setUfs] = useState<Item[]>([]);
  const [cities, setCities] = useState<Item[]>([]);
  const [selectedUf, setActualUf] = useState('0');
  const [selectedCity, setActualCity] = useState('0');

  useEffect(() => {
    interface IBGEUFResponse {
      id: number;
      sigla: string;
    };

    Axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(response => {
        setUfs(response.data.map((uf: IBGEUFResponse) => {
          return {
            id: uf.id,
            label: uf.sigla.toUpperCase(),
            value: uf.sigla,
          };
        }));
      });
  }, []);

  useEffect(() => {
    if (selectedUf === '0') {
      return;
    }

    setActualCity('0');

    interface IBGEMunicipioResponse {
      id: number;
      nome: string;
    };

    Axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response => {
        setCities(response.data.map((municipio: IBGEMunicipioResponse) => {
          return {
            id: municipio.id,
            label: municipio.nome.split(' ').map(s => `${s.charAt(0).toUpperCase()}${s.substring(1)}`).join(' '),
            value: municipio.nome,
          };
        }));
      });
  }, [selectedUf]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ImageBackground
        source={require('../../assets/home-background.png')}
        style={styles.container}
        imageStyle={{ width: 274, height: 368 }}
      >
        <View style={styles.main}>
          <Image source={require('../../assets/logo.png')} />
          <View>
            <Text style={styles.title}>
              Seu marketplace de coleta de resíduos.
            </Text>
            <Text style={styles.description}>
              Ajudando pessoas a encontrarem pontos de coleta de forma eficiente.
            </Text>
          </View>
        </View>
        <View>
          <View style={{ paddingBottom: 15 }}>
            <Select
              useNativeAndroidPickerStyle={false}
              style={selectStyle}
              value={selectedUf}
              placeholder={{ label: "selecione uma UF", value: '0' }}
              onValueChange={(value) => setActualUf(value)} items={ufs}
            />
            <View style={{ paddingBottom: 15 }} />
            <Select
              useNativeAndroidPickerStyle={false}
              style={selectStyle}
              value={selectedCity}
              placeholder={{ label: "selecione uma Cidade", value: '0' }}
              onValueChange={(value) => setActualCity(value)} items={cities}
            />
          </View>

          <RectButton style={styles.button}
            onPress={() => {
              navigation.navigate('points', { city: selectedCity, uf: selectedUf });
            }}
          >
            <View style={styles.buttonIcon}>
              <Text>
                <Icon name="arrow-right" color="#FFF" size={24} />
              </Text>
            </View>
            <Text style={styles.buttonText}>
              Entrar
              </Text>
          </RectButton>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
};

export default Home;
