import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
console.log(SCREEN_WIDTH);

export default function App() {
  const [city, setCity] = useState('Loading..');
  const [ok, setOk] = useState(true);
  const [forecasts, setForecasts] = useState([]);
  const [high, setHigh] = useState(0);
  const [low, setLow] = useState(0);
  const [pop, setPop] = useState(false);

  const getLocation = async () => {
    console.log('getLocation start');
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setOk(false);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setCity(location[0].city);
  };
  const getWeather = async () => {
    console.log('getWeather start');

    const API_KEY =
      'MZs7g2PfCkpUqvD%2BibMxZH1cxGcxMpN4DuII6E4cF7qX0WtgW9fp8E4pTPph%2FzwBO4UNnr6Sh2HkTZZTgKD%2FCA%3D%3D';

    const x = 58;
    const y = 74;
    // 임의로 x, y좌표 설정 -> 나중에 수정하기 #
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const hour = today.getHours();
    const checkDay = hour >= 2 ? today.getDate() : today.getDate() - 1;
    const day = String(checkDay).padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    //console.log(dateStr); // "20230501"

    const response = await fetch(
      `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?dataType=json&serviceKey=${API_KEY}&numOfRows=160&pageNo=1&base_date=${dateStr}&base_time=0200&nx=58&ny=74`
    );
    const json = await response.json();
    const jsonData = json.response.body.items.item;
    //console.log(jsonData.length, jsonData[1].category);

    for (let i = 0; i < jsonData.length; i++) {
      if (jsonData[i].category === 'TMX') setHigh(jsonData[i].fcstValue);
      else if (jsonData[i].category === 'TMN') {
        setLow(jsonData[i].fcstValue);
        //console.log(jsonData[i].fcstTime);
      } else if (jsonData[i].category === 'POP') {
        if (jsonData[i].fcstValue !== 0) setPop(true);
      }
    }

    console.log(high, low, pop);
  };
  useEffect(() => {
    getLocation();
    getWeather();
  });

  return (
    // 뷰의 배경이 미세먼지 농도에 따라 바뀌도록 설정해도 좋을듯?
    <View style={styles.container}>
      <StatusBar style={'dark'}></StatusBar>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        <View sytle={styles.tempview}>
          <View>
            <Text sytle={styles.description}>max</Text>
            <Text style={styles.temp}>{high}</Text>
          </View>
          <View>
            <Text style={styles.temp}>{low}</Text>
          </View>
        </View>
        <View style={styles.tempview}>
          <Text>Test</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tomato',
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 68,
  },
  weather: {},
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temp: {
    fontSize: 80,
  },
  tempview: {
    marginTop: 20,
    marginLeft: 20,
  },
  description: {
    marginTop: -30,
    fontSize: 40,
  },
});
