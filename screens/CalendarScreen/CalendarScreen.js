import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar } from "react-native-calendars";
import { FIREBASE_DB } from "../../firebase";
import {
  collection,
  getDocs,
  where,
  query,
  onSnapshot,
} from "firebase/firestore";
import { FIREBASE_AUTH } from "../../firebase";

const CalendarScreen = () => {
  const auth = FIREBASE_AUTH;

  const [dataUser, setDataUser] = useState({});

  const [markedDates, setMarkedDates] = useState({});

  const formatMarkedDates = (data) => {
    const dates = {};
    data[0].date.forEach((item) => {
      dates[item] = { selected: true, selectedColor: "green" };
    });
    setMarkedDates(dates);
  };

  useEffect(() => {
    const fetchData = async () => {
      const username = auth.currentUser?.displayName;
      if (username) {
        const q = query(
          collection(FIREBASE_DB, "Calendar"),
          where("username", "==", username)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const data = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));
          if (data.length > 0) {
            formatMarkedDates(data);
          }
        });
        return () => unsubscribe();
      }
    };
    fetchData();
  }, [auth.currentUser]);

  const onDayPress = async (day) => {
    console.log("selected day", day);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progress</Text>
      <View>
        <Calendar
          style={styles.calendar}
          onDayPress={onDayPress}
          markedDates={markedDates}
        />
      </View>
    </View>
  );
};

export default CalendarScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFC",
    paddingTop: 30,
    padding: 10,
  },
  title: {
    paddingLeft: 10,
    fontSize: 30,
    fontWeight: "bold",
  },
  calendar: {
    borderWidth: 1,
    borderColor: "#e8e8e8",
    borderRadius: 2,
    marginTop: 15,
  },
});
