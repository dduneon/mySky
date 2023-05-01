import React, {useEffect, useState} from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import {StatusBar} from "expo-status-bar";
import * as Location from "expo-location"

const { width:SCREEN_WIDTH }= Dimensions.get("window");
console.log(SCREEN_WIDTH);
export default function App() {
    const [city, setCity] = useState("Loading..");
    const [forecasts, setForecasts] = useState([]);
    const [ok, setOk] = useState(true);

    const API_KEY = "MZs7g2PfCkpUqvD%2BibMxZH1cxGcxMpN4DuII6E4cF7qX0WtgW9fp8E4pTPph%2FzwBO4UNnr6Sh2HkTZZTgKD%2FCA%3D%3D";
    const getWeather = async() => {
        const {granted} = await Location.requestForegroundPermissionsAsync();
        if (!granted) {
            setOk(false);
        }
        const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5})
        const location = await Location.reverseGeocodeAsync(
            {latitude, longitude},
            {useGoogleMaps: false}
        );
        // 사용자의 Location을 받아옴
        setCity(location[0].city);
        // 사용자의 도시명을 설정

        const x = 58;
        const y = 74;
        // 임의로 x, y좌표 설정 -> 나중에 수정하기 #

        const date = Date();
        console.log(date);

        const response = await fetch(`https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?dataType=json&serviceKey=MZs7g2PfCkpUqvD%2BibMxZH1cxGcxMpN4DuII6E4cF7qX0WtgW9fp8E4pTPph%2FzwBO4UNnr6Sh2HkTZZTgKD%2FCA%3D%3D&numOfRows=160&pageNo=1&base_date=20230501&base_time=0200&nx=58&ny=74`);
        const json = await response.json();

        // 공공데이터 날씨 API 사용하여 받아옴 #dev1
        // 수정할점
        // 1. baseDate -> 오늘의 날짜, format: 20230501 (#dev1)
        // 2. baseTime -> 0200 (안지났다면?)

        console.log(latitude, longitude);
        console.log(json);
        // 1. 일 최저기온 최고기온 가져오기
        // 2. 강수량 가져오기
    };
    useEffect(() => {
        getWeather();
    })
  return ( // 뷰의 배경이 미세먼지 농도에 따라 바뀌도록 설정해도 좋을듯?
    <View style={styles.container}>
        <StatusBar style={"dark"}></StatusBar>
        <View style={styles.city}>
            <Text style={styles.cityName}>{city}</Text>
        </View>
        <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.weather}
        >
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "tomato",
    },
    city: {
        flex: 1.2,
        justifyContent: "center",
        alignItems: "center",
    },
    cityName: {
        fontSize: 68,
        fontWeight: 500,
    },
    weather: {
    },
    day: {
        width: SCREEN_WIDTH,
        alignItems: "center",
    },
    temp: {
        marginTop: 50,
        fontSize: 178,
    },
    description: {
        marginTop: -30,
        fontSize: 60,
    },
})