import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
  Alert,
  Image,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { FIREBASE_DB } from "../../firebase";
import { FIREBASE_AUTH } from "../../firebase";
import { useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";

const DismissKeyboard = ({ children }) => {
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  );
};

export default function BMIScreen() {
  const [age, setAge] = useState(0);
  const [height, setHeight] = useState(0);
  const [weight, setWeight] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [BMI, setBMI] = useState(0);
  const [description, setDescription] = useState("");
  const auth = FIREBASE_AUTH;

  const findAndUpdateFirebaseData = async (BMI) => {
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
            bmi: [BMI.toFixed(2)],
            age,
            height,
            weight,
          });
          console.log("New document added for user:", username);
        } else {
          // If existing data found, update the document
          const docRef = querySnapshot.docs[0].ref;
          const existingData = querySnapshot.docs[0].data();

          await updateDoc(docRef, {
            bmi: BMI.toFixed(2),
            age,
            height,
            weight,
          });
          console.log("Document updated for user:", username);
        }
      } catch (error) {
        console.error("Error updating document: ", error);
      }
    }
  };

  const clearField = () => {
    setSubmitted(() => {
      return false;
    });
    setAge(() => {
      return 0;
    });
    setHeight(() => {
      return 0;
    });
    setWeight(() => {
      return 0;
    });
    setDescription("");
  };

  const calculateBMI = () => {
    if (age == 0 || height == 0 || weight == 0) {
      Alert.alert("Warning", "Age, Height, Weight are not null !", [
        {
          text: "OK",
        },
      ]);
    } else {
      setBMI(() => {
        let w = parseFloat(weight);
        let h = parseFloat(height);
        let bmi = (w * 10000) / (h * h);
        bmi = bmi.toFixed(2);
        return bmi;
      });
    }

    const w = parseFloat(weight);
    const h = parseFloat(height);
    const bmi = (w * 10000) / (h * h);

    if (bmi < 18.5) {
      setDescription("UnderWeight, You are in the underweight range");
    } else if (bmi >= 18.5 && bmi <= 24.9) {
      setDescription("Normal, You are in the normalweight range.");
    } else if (bmi >= 25 && bmi <= 29.9) {
      setDescription("OverWeight, You are in the overweight range");
    } else if (bmi >= 30) {
      setDescription("Obese, You are in the obese range");
    }
    setSubmitted(true);
    findAndUpdateFirebaseData(bmi,age,height,weight);
  };

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <Image
          style={{ marginBottom: 40 }}
          source={require("../../assets/logo.png")}
        />

        {/* AGE */}
        <View style={styles.field_container}>
          <MaterialCommunityIcons
            name="account"
            size={24}
            color="grey"
            style={{ marginRight: 15 }}
          />
          <View style={styles.field_right}>
            <Text>Age</Text>
            <TextInput
              value={age}
              onChangeText={(newAge) => setAge(newAge)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* HEIGHT */}
        <View style={styles.field_container}>
          <MaterialCommunityIcons
            name="human-male-height-variant"
            size={24}
            color="grey"
            style={{ marginRight: 15 }}
          />
          <View style={styles.field_right}>
            <Text>Height (cm)</Text>
            <TextInput
              keyboardType="numeric"
              value={height}
              onChangeText={(newHeight) => setHeight(newHeight)}
            />
          </View>
        </View>

        {/* WEIGHT */}
        <View style={styles.field_container}>
          <MaterialCommunityIcons
            name="format-line-weight"
            size={24}
            color="grey"
            style={{ marginRight: 15 }}
          />
          <View style={styles.field_right}>
            <Text>Weight (kg)</Text>
            <TextInput
              keyboardType="numeric"
              value={weight}
              onChangeText={(newWeight) => setWeight(newWeight)}
            />
          </View>
        </View>

        {/* BUTTON */}
        <View style={styles.button_container}>
          <TouchableOpacity
            onPress={calculateBMI}
            style={{
              backgroundColor: "red",
              marginRight: 20,
            }}
          >
            <Text style={styles.button_text}>Calculate</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={clearField}
            style={{
              backgroundColor: "red",
            }}
          >
            <Text style={styles.button_text}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* SHOW BMI */}
        {submitted ? (
          <Text numberOfLines={2} style={styles.text}>
            Your BMI: {BMI}
          </Text>
        ) : null}
        <Text style={styles.description}>{description}</Text>
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  button_text: {
    color: "white",
    paddingHorizontal: 25,
    paddingVertical: 7,
    textAlign: "center",
    fontSize: 18,
  },
  field_container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  field_right: {
    flex: 1,
    borderBottomColor: "lightgrey",
    borderBottomWidth: 1,
  },
  button_container: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  text: {
    color: "black",
    fontSize: 20,
    margin: 20,
  },
  description: {
    color: "black",
    fontSize: 15,
    margin: 5,
  },
});
