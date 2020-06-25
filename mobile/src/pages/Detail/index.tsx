import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Image, Text, ActivityIndicator } from 'react-native';
import styles from './styles';
import { Feather as Icon, FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as MailComposer from 'expo-mail-composer';
import api from '../../services/api';
import { Linking } from 'expo';

interface Params {
  point_id: number;
}

interface PointData {
  id: number;
  name: string;
  email: string;
  phone: string;
  image: string;
  city: string;
  uf: string;
  items: [{
    name: string;
    image: string;
  }]
}

const Detail = () => {
  const navigator = useNavigation();
  const route = useRoute();

  const [data, setPoint] = useState<PointData | undefined>(undefined);
  const routeParams = route.params as Params;

  useEffect(() => {
    api.get(`/points/${routeParams.point_id}`)
      .then(result => {
        setPoint(result.data.point);
      });
  }, []);

  function handleWhatsapp() {
    const text = 'Tenho interesse sobre a coleta dos resíduos'
    Linking.openURL(`whatsapp://send?phone=${data?.phone}&text=${text}`);
  }

  function handleSendEmail() {
    MailComposer.composeAsync({
      subject: 'interesse na coleta de resíduos',
      recipients: [data?.email || ''],
    });
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {
        data
          ? (
            <View style={styles.container}>
              <TouchableOpacity onPress={() => { navigator.goBack(); }}>
                <Icon name="arrow-left" color="#34cb79" size={30} />
              </TouchableOpacity>

              <Image style={styles.pointImage} source={{ uri: data.image }} />

              <Text style={styles.pointName}>{data.name}</Text>

              <Text style={styles.pointItemsTitle}>Itens Coletados</Text>
              <Text style={styles.pointItems}>
                {data.items.map(i => i.name).join(', ').replace(/, $/, '')}
              </Text>

              <View style={styles.address}>
                <Text style={styles.addressTitle}>
                  Endereço
                </Text>
                <Text style={styles.addressContent}>
                  {data.city}, {data.uf}
                </Text>
              </View>
            </View>
          )
          : (
            <SafeAreaView style={{ justifyContent: 'center', flex: 1 }}>
              <ActivityIndicator size="large" />
            </SafeAreaView>
          )
      }
      <View style={styles.footer}>
        <RectButton style={styles.button} onPress={handleWhatsapp}>
          <FontAwesome name="whatsapp" color="#FFF" size={20} />
          <Text style={styles.buttonText}>WhatsApp</Text>
        </RectButton>
        <RectButton style={styles.button} onPress={handleSendEmail}>
          <Icon name="mail" color="#FFF" size={20} />
          <Text style={styles.buttonText}>E-mail</Text>
        </RectButton>
      </View>
    </SafeAreaView>
  );
};

export default Detail;
