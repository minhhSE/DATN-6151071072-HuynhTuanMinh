import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'

const RestScreen = () => {
    const navigation = useNavigation();
    let timer = 0;
    const [timeLeft, setTimeLeft] = useState(3);
    const startTime = () => {
        setTimeout(() =>{
            if(timeLeft <= 0){
                navigation.goBack();
                clearTimeout(timer);
            }
            setTimeLeft(timeLeft - 1);
        },1000);
    };
    useEffect(() => {
        startTime();
        return () => clearTimeout(timer);
    });
  return (
    <SafeAreaView>
      <Image
        // resizeMode="contain"
        source={{
          uri: "https://cdn-images.cure.fit/www-curefit-com/image/upload/fl_progressive,f_auto,q_auto:eco,w_500,ar_500:300,c_fit/dpr_2/image/carefit/bundle/CF01032_magazine_2.png",
        }}
        style={{ width: "100%", height: 420 }}
      />
      <Text style ={styles.time}>TAKE A BREAK</Text>
      <Text style ={styles.time}>{timeLeft}</Text>
    </SafeAreaView>
  )
}

export default RestScreen

const styles = StyleSheet.create({
    time: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 50,
        
    },
})