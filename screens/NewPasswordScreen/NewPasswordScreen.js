import {
  StyleSheet,
  Text,
  View,
  Image,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Custominput from "../../components/Custominput/Custominput";
import Custombutton from "../../components/Custombutton/Custombutton";
import SocialSignInbuttons from "../../components/SocialSignInbuttons";
import { useNavigation } from "@react-navigation/native";
import { useForm } from "react-hook-form";


const NewPasswordScreen = () => {
  const {control,handleSubmit} = useForm();

  const navigation = useNavigation();

  const onSubmitPressed = (data) => {
    console.warn(data);
    navigation.navigate('Home');
  };

  const onSignInPressed = () => {
    navigation.navigate('SignIn');
  };



  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Reset your password</Text>

        <Custominput 
        name = "code"
        control = {control}
        placeholder="Code"  
        rules={{
          required: "Code is required"
        }}
        />

        <Custominput
          name = "password"
          control={control}
          placeholder="Enter your new password"
          secureTextEntry
          rules={{
            required: "Password is required",
            minLength: {
              value: 3,
              message: "Password should be at least 8 characters long",
            },
          }}
         
        />

        <Custombutton text="Submit" onPress={handleSubmit(onSubmitPressed)} />

        <Custombutton
          text="Back to Sign in"
          onPress={onSignInPressed}
          type="TERTIARY"
        />
      </View>
    </ScrollView>
  );
};

export default NewPasswordScreen;

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
