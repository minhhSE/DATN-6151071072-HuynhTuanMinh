import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  ScrollView,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import Custominput from "../../components/Custominput/Custominput";
import Custombutton from "../../components/Custombutton/Custombutton";
import SocialSignInbuttons from "../../components/SocialSignInbuttons";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { FIREBASE_AUTH } from "../../firebase";
import { FactorId, signInWithEmailAndPassword,updateProfile } from "firebase/auth";

const SignInScreen = () => {
  const auth = FIREBASE_AUTH;
 
  const { height } = useWindowDimensions();

  const navigation = useNavigation();

  const [loading,setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSignInPressed = async data => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth,data.email,data.password,data.username)
      console.log(response);
    } catch (e) {
      console.log("Oops", e.message);
    }
    setLoading(false);
  };

  const onForgotPasswordPressed = () => {
    navigation.navigate("ForgotPassword");
  };

  const onSignUpPressed = () => {
    navigation.navigate("SignUp");
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Image
          style={[styles.logo, { height: height * 0.3 }]}
          source={require("../../assets/Logo_3.png")}
          resizeMode="contain"
        />

        <Custominput
          name="email"
          placeholder="Email"
          control={control}
          rules={{ required: "Email is required" }}
        />
        <Custominput
          name="password"
          placeholder="Password"
          secureTextEntry
          control={control}
          rules={{ required: "Password is required", minLength: 
          {
            value:3,
            message: 'Password should be minimum 3 characters long',
          },
         }}
        />

        <Custombutton text="Sign In" onPress={handleSubmit(onSignInPressed)} />

       {/* <Custombutton
          text="Forgot password?"
          onPress={onForgotPasswordPressed}
          type="TERTIARY"
        />

        <SocialSignInbuttons />*/}

        <Custombutton
          text="Don't have an accout? Create one"
          onPress={onSignUpPressed}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

export default SignInScreen;

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
});
