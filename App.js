import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { FIREBASE_AUTH } from "./firebase";
import { useState } from "react";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import BMIScreen from "./screens/BMIScreen";
import { FitnessConText } from "./Context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { COLORS } from "./constants/theme";
import { navigationRef } from "./components/Root/RootNavigation";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import WorkoutScreen from "./screens/WorkoutScreen";
import FitScreen from "./screens/FitScreen";
import RestScreen from "./screens/RestScreen";
import CalendarScreen from "./screens/CalendarScreen";
import FontAwesome5Icons from "react-native-vector-icons/FontAwesome5";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import ConfirmEmailScreen from "./screens/ConfirmEmailScreen";
import NewPasswordScreen from "./screens/NewPasswordScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ProfileScreen from "./screens/ProfileScreen";

export default function App() {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();

  const auth = FIREBASE_AUTH;
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  if (user === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  function AuthStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
      </Stack.Navigator>
    );
  }

  function AppStack() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            height: 55,
          },
          tabBarIcon: ({ focused }) => {
            const icons = {
              HomeExercises: "dumbbell",
              Progress: "calendar-alt",
              BMICalculator: "calculator",
              UserInfo: "user",
            };
            return (
              <FontAwesome5Icons
                name={icons[route.name]}
                color={focused ? COLORS.accent : COLORS.black}
                style={{
                  fontSize: 20,
                  opacity: focused ? 1 : 0.5,
                }}
              />
            );
          },
        })}
      >
        <Tab.Screen name="HomeExercises" component={HomeStack} />
        <Tab.Screen name="BMICalculator" component={BMIStack} />
        <Tab.Screen name="Progress" component={ProgressStack} />
        <Tab.Screen name="UserInfo" component={ProfileScreen} />
      </Tab.Navigator>
    );
  }

  function BMIStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BMICalculate" component={BMIScreen} />
      </Stack.Navigator>
    );
  }

  function ProgressStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Calendar" component={CalendarScreen} />
      </Stack.Navigator>
    );
  }

  function HomeStack() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Workout" component={WorkoutScreen} />
        <Stack.Screen name="Fit" component={FitScreen} />
        <Stack.Screen name="Rest" component={RestScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <FitnessConText>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <NavigationContainer ref={navigationRef}>
          {user ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
      </SafeAreaView>
    </FitnessConText>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FBFC",
  },
});
