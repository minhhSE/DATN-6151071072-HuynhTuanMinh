import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import Custominput from "../../components/Custominput/Custominput";
import Custombutton from "../../components/Custombutton/Custombutton";
import SocialSignInbuttons from "../../components/SocialSignInbuttons";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import HomeScreen from "../HomeScreen/HomeScreen";

const EMAIL_REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const SignUpScreen = () => {
  //SignUp logic
  const auth = FIREBASE_AUTH;

  const { control, handleSubmit, watch } = useForm();

  const pwd = watch("password");

  const navigation = useNavigation();

  const onRegisterPressed = async (data) => {
    const { username, email, password } = data;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: username,
      });

      navigation.navigate("SignIn");
      
    } catch (e) {
      console.log("Oops", e.message);
    }
  };

  const onSignInPressed = () => {
    navigation.navigate("SignIn");
  };

  const onTermsOfUsePressed = () => {
    console.warn("termsOfUse");
  };
  const OnPrivacyPolicyPressed = () => {
    console.warn("onPrivacyPolicy");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Create an accout</Text>

        {/*  <Custominput
          name="name"
          control={control}
          placeholder="Name"
          rules={{
            required: "Name is required",
            minLength: {
              value: 3,
              message: "Name should be at least 3 characters long",
            },
            maxLength: {
              value: 24,
              message: "Name should be max 24 characters long",
            },
          }}
        /> */}

        <Custominput
          name="username"
          control={control}
          placeholder="Username"
          rules={{
            required: "Username is required",
            minLength: {
              value: 3,
              message: "Username should be minimum 3 characters long",
            },
            maxLength: {
              value: 24,
              message: "Username should be maximum 24 characters long",
            },
          }}
        />

        <Custominput
          name="email"
          control={control}
          placeholder="Email"
          rules={{
            required: "Email is required",
            pattern: { value: EMAIL_REGEX, message: "Email is invalid" },
          }}
        />

        <Custominput
          name="password"
          control={control}
          placeholder="Password"
          secureTextEntry
          rules={{
            required: "Password is required",
            minLength: {
              value: 3,
              message: "Password should be at least 8 characters long",
            },
          }}
        />
        <Custominput
          name="password-repeat"
          control={control}
          placeholder="Repeat Password"
          secureTextEntry
          rules={{
            validate: (value) => value === pwd || "Password do not match",
          }}
        />

        <Custombutton
          text="Register"
          onPress={handleSubmit(onRegisterPressed)}
        />

        {/*<Text style={styles.text}>
          By registering, you confirm that you are accept our{" "}
          <Text style={styles.link} onPress={onTermsOfUsePressed}>
            Terms of Use
          </Text>{" "}
          and{" "}
          <Text style={styles.link} onPress={OnPrivacyPolicyPressed}>
            Privacy Policy
          </Text>
        </Text>*/}

        {/* <SocialSignInbuttons /> */}

        <Custombutton
          text="Have an account? Sign in"
          onPress={onSignInPressed}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: "50%",
    maxWidth: 300,
    maxHeight: 200,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#051C60",
    margin: 10,
  },
  text: {
    color: "gray",
    marginVertical: 10,
  },
  link: {
    color: "#FDB075",
  },
});
