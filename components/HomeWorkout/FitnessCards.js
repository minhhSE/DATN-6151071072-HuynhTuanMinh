import { Pressable, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import fitness from "../../data/fitness";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  collection,
  getDocs,
  where,
  query,
  onSnapshot,
} from "firebase/firestore";
import { useEffect } from "react";
import { FIREBASE_DB } from "../../firebase";
import { FIREBASE_AUTH } from "../../firebase";

const FitnessCards = ({ recommendedWorkouts }) => {
  const FitnessData = fitness;
  const [data, setData] = useState(0);
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;
  const [showHiit, setShowHiit] = useState(false);
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(currentDate);

  useEffect(() => {
    const username = auth.currentUser?.displayName;
    if (username) {
      const q = query(
        collection(FIREBASE_DB, "Calendar"),
        where("username", "==", username)
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          if (!querySnapshot.empty) {
            const docData = querySnapshot.docs[0].data();
            const dateLength = docData?.date?.length || 0;
            setData(dateLength);
            setShowHiit(dateLength >= 5);
          } else {
            setData(0);
            setShowHiit(false);
          }
        },
        (error) => {
          console.error("Error fetching data from Firestore: ", error);
        }
      );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    }
  }, [auth.currentUser]);

  return (
    <View>
      {FitnessData.map((item, key) =>
        item.id !== "4" ? (
          <>
            <Pressable
              onPress={() =>
                navigation.navigate("Workout", {
                  image: item.image,
                  excersises: item.excersises,
                  id: item.id,
                })
              }
              // style={styles.imageClick}
              style={[
                styles.imageClick,
                recommendedWorkouts.some((re) => re === item.name) &&
                  styles.recommendedImage,
              ]}
              key={key}
            >
              <Image style={styles.image} source={{ uri: item.image }} />
              <Text style={styles.name}>{item.name}</Text>
              {recommendedWorkouts.some((re) => re === item.name) ? (
                <MaterialCommunityIcons
                  style={styles.icon1}
                  name="lightning-bolt"
                  size={24}
                  color="black"
                />
              ) : (
                <MaterialCommunityIcons
                  style={styles.icon2}
                  name="lightning-bolt"
                  size={24}
                  color="black"
                />
              )}
            </Pressable>
          </>
        ) : (
          data >= 5 && (
            <Pressable
              onPress={() =>
                navigation.navigate("Workout", {
                  image: item.image,
                  excersises: item.excersises,
                  id: item.id,
                })
              }
              // style={styles.imageClick}
              style={[
                styles.imageClick,
                recommendedWorkouts.some((re) => re === item.name) &&
                  styles.recommendedImage,
              ]}
              key={key}
            >
              <Image style={styles.image} source={{ uri: item.image }} />
              <Text style={styles.name}>{item.name}</Text>
              {recommendedWorkouts.some((re) => re === item.name) ? (
                <MaterialCommunityIcons
                  style={styles.icon1}
                  name="lightning-bolt"
                  size={24}
                  color="black"
                />
              ) : (
                <MaterialCommunityIcons
                  style={styles.icon2}
                  name="lightning-bolt"
                  size={24}
                  color="black"
                />
              )}
            </Pressable>
          )
        )
      )}
    </View>
  );
};

export default FitnessCards;

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 150,
    borderRadius: 7,
    //marginLeft: 10,
  },
  imageClick: {
    alignContent: "center",
    justifyContent: "center",
    margin: 10,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 9,
  },
  name: {
    position: "absolute",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    top: 20,
    left: 20,
  },
  recommendedImage: {
    borderWidth: 2, // Add border width
    borderColor: "cyan", // Change border color to cyan
  },
  icon1: {
    position: "absolute",
    color: "cyan",
    bottom: 15,
    left: 20,
  },
  icon2: {
    position: "absolute",
    color: "#fff",
    bottom: 15,
    left: 20,
  },
});
