import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useContext } from "react";
import { FitnessItems } from "../../Context";
import { AntDesign } from "@expo/vector-icons";
import { FIREBASE_DB } from "../../firebase";
import { FIREBASE_AUTH } from "../../firebase";
import {
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";

const WorkoutScreen = () => {
  const { minutes, setMinutes, completed, setCompleted } =
    useContext(FitnessItems);

  const [startTime, setStartTime] = useState(null);
  const [accumulatedTime, setAccumulatedTime] = useState(0);

  const route = useRoute();
  //console.log(route.params);
  const navigation = useNavigation();
  const auth = FIREBASE_AUTH;

  // Function to find and update data in Firebase
  const findAndUpdateFirebaseData = async () => {
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 2);
    const formattedDate = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "Asia/Ho_Chi_Minh",
    }).format(currentDate);

    const [year, month, day] = formattedDate.split("-");
    const finalDate = `${year}-${month}-${day}`;

    const currentUser = auth.currentUser;

    if (currentUser) {
      const userId = currentUser.uid;
      const username = currentUser.displayName;

      try {
        const q = query(
          collection(FIREBASE_DB, "Calendar"),
          where("username", "==", username)
        );
        // Check if data already exists for the user
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          // If no existing data found, add new document
          await addDoc(collection(FIREBASE_DB, "Calendar"), {
            username,
            date: [formattedDate],
          });
          console.log("New document added for user:", username);
        } else {
          // If existing data found, update the document
          const docRef = querySnapshot.docs[0].ref;
          const existingData = querySnapshot.docs[0].data();
          const existingDates = new Set(existingData.date);

          // Add the new date to the Set
          existingDates.add(finalDate);

          // Convert the Set back to an array
          const updatedDates = Array.from(existingDates);
          await updateDoc(docRef, {
            date: updatedDates,
          });
          console.log("Document updated for user:", username);
        }
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  const handleStartButtonPress = () => {
    setStartTime(new Date());
    navigation.navigate("Fit", {
      excersises: route.params.excersises,
    });
    //setCompleted([]);
    findAndUpdateFirebaseData();
  };

  useEffect(() => {
    let interval;
    if (startTime) {
      interval = setInterval(() => {
        const currentTime = new Date();
        const newElapsedTime = Math.floor(
          (currentTime - startTime) / 1000 / 60
        );
        setMinutes(minutes + accumulatedTime + newElapsedTime);
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
        if (startTime) {
          const currentTime = new Date();
          const newElapsedTime = Math.floor(
            (currentTime - startTime) / 1000 / 60
          );
          setAccumulatedTime(minutes + accumulatedTime + newElapsedTime);
        }
      }
    };
  }, [startTime]);

  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        <Image style={styles.image} source={{ uri: route.params.image }} />
        <Ionicons
          onPress={() => navigation.goBack()}
          style={styles.backIcon}
          name="arrow-back-outline"
          size={28}
          color="white"
        />

        {route.params.excersises.map((item, index) => (
          <Pressable style={styles.pressable} key={index}>
            <Image style={styles.exercises} source={{ uri: item.image }} />
            <View style={styles.brpExercise}>
              <Text style={styles.nameExercise}>{item.name}</Text>

              <Text style={styles.repExercise}>x{item.sets}</Text>
            </View>

            {completed.includes(item.name) ? (
              <AntDesign
                style={styles.icon}
                name="checkcircle"
                size={24}
                color="green"
              />
            ) : null}
          </Pressable>
        ))}
      </ScrollView>
      <Pressable onPress={handleStartButtonPress} style={styles.brButton}>
        <Text style={styles.button}>START</Text>
      </Pressable>
    </>
  );
};

export default WorkoutScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  image: {
    width: "100%",
    height: 170,
    resizeMode: "cover",
  },
  backIcon: {
    position: "absolute",
    left: 10,
    top: 30,
  },

  exercises: {
    width: 90,
    height: 90,
  },
  pressable: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  brpExercise: {
    marginLeft: 10,
  },
  nameExercise: {
    fontSize: 17,
    fontWeight: "bold",
    width: 170,
  },
  repExercise: {
    marginTop: 4,
    fontSize: 17,
    color: "grey",
  },
  brButton: {
    backgroundColor: "blue",
    padding: 10,
    marginLeft: "auto",
    marginRight: "auto",
    marginVertical: 20,
    width: 120,
    borderRadius: 6,
  },
  button: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  icon: {
    marginLeft: 40,
  },
});
