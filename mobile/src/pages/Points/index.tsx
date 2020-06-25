import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator, SafeAreaView } from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import { SvgUri } from 'react-native-svg';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import api from '../../services/api';
import styles from './styles';

interface CollectionItem {
  id: number;
  name: string,
  image_url: string;
}

interface Point {
  id: number;
  name: string;
  email: string;
  phone: string;
  image: string;
  city: string;
  uf: string;
  latitude: number;
  longitude: number;
}

interface Params {
  uf: string;
  city: string;
}

const Points = () => {
  const navigator = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  const [location, setLocation] = useState<{ latitude: number, longitude: number } | undefined>(undefined);
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [points, setPoints] = useState<Point[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  useEffect(() => {
    Permissions.askAsync(Permissions.LOCATION)
      .then(({ status }) => {
        if (status === 'granted') {
          Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest, maximumAge: 50 })
            .then(location => {
              const { latitude, longitude } = location.coords;
              setLocation({ latitude, longitude });
            });
        }
      });
  }, []);

  useEffect(() => {
    api.get('/items').then(response => {
      setItems(response.data);
    });
  }, []);

  useEffect(() => {
    api.get('/points', {
      params: {
        city: routeParams.city,
        uf: routeParams.uf,
        items: selectedItems
      }
    })
      .then(response => {
        setPoints(response.data);
      });
  }, [selectedItems]);

  function renderMap() {
    return !location
      ? <ActivityIndicator size="large" />
      : <MapView
        showsMyLocationButton
        showsUserLocation
        style={styles.map}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.014,
          longitudeDelta: 0.014,
        }}
      >
        {
          points.map(p => (
            <Marker key={p.id}
              coordinate={{
                latitude: p.latitude,
                longitude: p.longitude
              }}
              style={styles.mapMarker}
              onPress={() => handleNavigateToDetails(p.id)}
            >
              <View style={styles.mapMarkerContainer}>
                <Image
                  style={styles.mapMarkerImage}
                  source={{ uri: p.image }}
                />
                <Text style={styles.mapMarkerTitle} numberOfLines={2}>
                  {p.name}
                </Text>
              </View>
            </Marker>
          ))
        }
      </MapView >
  }

  function handleNavigateToDetails(id: number) {
    navigator.navigate('detail', { point_id: id });
  }

  function renderItems() {
    return items.map(i => (
      <TouchableOpacity
        key={i.id}
        style={[styles.item, selectedItems.includes(i.id) ? styles.selectedItem : []]}
        onPress={() => handleSelectItem(i.id)}
        activeOpacity={.6}
      >
        <SvgUri width={42} height={42} uri={i.image_url} />
        <Text style={styles.itemTitle}>{i.name}</Text>
      </TouchableOpacity>
    ));
  }

  function handleSelectItem(id: number) {
    setSelectedItems(
      selectedItems.findIndex(iid => iid === id) >= 0
        ? selectedItems.filter(iid => iid !== id)
        : [...selectedItems, id]
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => { navigator.goBack(); }}>
          <Icon name="arrow-left" color="#34cb79" size={30} />
        </TouchableOpacity>

        <Text style={styles.title}>
          Bem Vindo
        </Text>
        <Text style={styles.description}>
          Encontre no mapa um Ponto de Coleta.
        </Text>

        <View style={styles.mapContainer}>
          {renderMap()}
        </View>
      </View>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20 }}
        >
          <View style={styles.itemsContainer}>
            {renderItems()}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Points;
