import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Platform,
} from "react-native";
import React from "react";
import { FIREBASE_AUTH } from "../../firebase";
import { signOut } from "firebase/auth";
import { FontAwesome } from "@expo/vector-icons";
import FitnessCards from "../../components/HomeWorkout/FitnessCards";
import { useContext } from "react";
import { FitnessItems } from "../../Context";
import { updateProfile } from "firebase/auth";
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
import { useRef } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const HomeScreen = () => {
  const route = useRoute();
  const [bmi, setBMI] = useState(null);
  const [recommendedWorkouts, setRecommendedWorkouts] = useState([]);
  const [filteredWorkouts, setFilteredWorkouts] = useState([]);
  const auth = FIREBASE_AUTH;
  const navigation = useNavigation();
  const [showHiit, setShowHiit] = useState(false);

  const onLogOutPressed = () => {
    resetValues();
    signOut(auth);
  };

  const { workout, minutes, calories, resetValues } = useContext(FitnessItems);

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
            const data = querySnapshot.docs.map((doc) => doc.data());
            const firstDoc = data[0];
            if (firstDoc && firstDoc.date) {
              setShowHiit(firstDoc.date.length >= 5);
              setBMI(firstDoc.bmi); // Assuming BMI is stored as a field in the document
            } else {
              console.log("Document does not contain date or bmi field.");
              setShowHiit(false);
              setBMI(null);
            }
          } else {
            console.log("No documents found.");
            setShowHiit(false);
            setBMI(null);
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

  useEffect(() => {
    // Function to recommend workouts based on BMI group
    const recommendWorkouts = () => {
      // Based on BMI value, categorize into groups and recommend workouts accordingly
      let workouts = [];
      if (bmi === null) {
        workouts = [];
      } else if (bmi < 18.5) {
        workouts = ["CHEST BEGINNER", "ABS BEGINNER"];
      } else if (bmi >= 18.5 && bmi < 24.9) {
        workouts = ["ARM BEGINNER", "CHEST BEGINNER"];
      } else if (bmi >= 24.9 && bmi < 29.9) {
        workouts = ["FULL BODY", "ARM BEGINNER"];
      } else if (bmi >= 30) {
        workouts = ["FULL BODY", "CHEST BEGINNER"];
      }

      // Conditionally add "HIIT WORKOUT"
      if (showHiit) {
        workouts.push("HIIT WORKOUT");
      }

      setRecommendedWorkouts(workouts);
    };

    recommendWorkouts();
  }, [bmi, showHiit]);

  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(currentDate);

  const [year, month, day] = formattedDate.split("-");

  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => console.log(token));

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const registerForPushNotificationsAsync = async () => {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  };

  const schedulePushNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Workout Reminder! 📬",
        body: "Don't forget to complete your workout today!",
      },
      trigger: { seconds: 1 },
    });
  };

  useEffect(() => {
    const scheduleDailyNotification = async () => {
      await Notifications.cancelAllScheduledNotificationsAsync(); // Clear existing notifications

      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Time to Workout! 💪",
          body: "Don't forget to complete your workout today!",
        },
        trigger: {
          hour: 9,
          minute: 0,
          repeats: true,
        },
      });
    };

    scheduleDailyNotification();
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.header}>HOME WORKOUT </Text>
        <View style={styles.headerAvatar}>
          <Pressable onPress={() => navigation.navigate("UserInfo")}>
            <View style={styles.imageContainerAvatar}>
              <Image
                source={require("../../assets/avatar.jpeg")}
                style={styles.imageAvatar}
              />
            </View>
          </Pressable>
          <View style={styles.title}>
            <Text style={styles.bigTitle}>
              Hi, {auth.currentUser?.displayName}
            </Text>
            <Text style={styles.smallTitle}>BMI: {bmi}</Text>
          </View>
          <TouchableOpacity onPress={onLogOutPressed}>
            <View style={styles.imageContainerAvatar}>
              <FontAwesome name="sign-out" size={30} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.belowHeader}>
          <View>
            <Text style={styles.belowHeaderNumber}>{workout}</Text>
            <Text style={styles.belowHeaderText}>WORKOUTS</Text>
          </View>
          <View>
            <Text style={styles.belowHeaderNumber}>{calories}</Text>
            <Text style={styles.belowHeaderText}>KCAL</Text>
          </View>
          <View>
            <Text style={styles.belowHeaderNumber}>{minutes}</Text>
            <Text style={styles.belowHeaderText}>MINS</Text>
          </View>
        </View>
        <View style={styles.imageBackGround}>
          <Image
            style={styles.image}
            source={{
              uri: "https://cdn-images.cure.fit/www-curefit-com/image/upload/c_fill,w_842,ar_1.2,q_auto:eco,dpr_2,f_auto,fl_progressive/image/test/sku-card-widget/gold2.png",
            }}
          />
        </View>

        <FitnessCards recommendedWorkouts={recommendedWorkouts} />
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#CD853F",
    padding: 10,
    height: "100%",
    width: "100%",
    paddingTop: 30,
  },
  header: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  belowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  belowHeaderNumber: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  belowHeaderText: {
    color: "#D0D0D0",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 17,
    marginTop: 6,
  },
  image: {
    width: "90%",
    height: 140,
    marginTop: 20,
    marginBottom: 5,
    borderRadius: 7,
  },
  imageBackGround: {
    justifyContent: "center",
    alignItems: "center",
  },
  headerAvatar: {
    flexDirection: "row",
    padding: 15,
  },
  imageContainerAvatar: {
    height: 50,
    width: 50,
    borderRadius: 25,
    overflow: "hidden",
  },
  imageAvatar: {
    height: "100%",
    width: "100%",
  },
  title: {
    paddingHorizontal: 10,
    flex: 1,
    justifyContent: "center",
  },
  bigTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  smallTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "300",
    opacity: 0.9,
  },
});
