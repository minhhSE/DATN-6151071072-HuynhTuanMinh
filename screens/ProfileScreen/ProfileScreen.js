import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Switch,
  Button,
  Alert,
  Modal,
  Pressable,
  ScrollView,
} from "react-native";
import { FIREBASE_AUTH } from "../../firebase";
import { FIREBASE_DB } from "../../firebase";
import { useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
  onSnapshot
} from "firebase/firestore";

const ProfileScreen = () => {
    const [age, setAge] = useState(null);
    const [height, setHeight] = useState(null);
    const [weight, setWeight] = useState(null);
    const [bmi, setBMI] = useState(null);
    const auth = FIREBASE_AUTH;

    useEffect(() => {
        const username = auth.currentUser?.displayName;
        if (username) {
          const q = query(
            collection(FIREBASE_DB, "Calendar"),
            where("username", "==", username)
          );
    
          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => doc.data());
            if (data.length > 0) {
              setAge(data[0].age);
              setHeight(data[0].height);
              setWeight(data[0].weight);
              setBMI(data[0].bmi); // Assuming BMI is stored as a field in the document
            } else {
              console.log("No such document!");
            }
          }, (error) => {
            console.error("Error fetching BMI from Firestore: ", error);
          });
    
          // Cleanup subscription on unmount
          return () => unsubscribe();
        }
      }, [auth.currentUser]);
  return (
    <>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../../assets/avatar.jpeg")}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{auth.currentUser?.displayName}</Text>
        </View>
        <View style={styles.separator} />

        <Text style={styles.sectionTitle}>User Information</Text>
        <View style={styles.settingItem}>
          <Text style={styles.label}>Username:</Text>
          <Text style={styles.value}>{auth.currentUser?.displayName}</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{auth.currentUser?.email}</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.label}>Height:</Text>
          <Text style={styles.value}>{weight} kg</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.label}>Weight:</Text>
          <Text style={styles.value}>{height} cm</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{age} years old</Text>
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.label}>BMI:</Text>
          <Text style={styles.value}>{bmi}</Text>
        </View>

        
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  partner: {
    color: "#666",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  label: {
    width: 150,
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    flex: 1,
    color: "#333",
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginVertical: 15,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor: "green",
  },
  option: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "center",
  },
  modalActionButton: {
    marginHorizontal: 10,
    paddingVertical: 10,
  },
  modalActionText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ProfileScreen;
