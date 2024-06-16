import { StyleSheet, Text, View } from "react-native";
import React from "react";
import Custombutton from "../Custombutton";

const SocialSignInbuttons = () => {
  const onSignInFacebook = () => {
    console.warn("facebook");
  };

  const onSignInGoogle = () => {
    console.warn("google");
  };

  const onSignInApple = () => {
    console.warn("apple");
  };
  
  return (
    <>
      <Custombutton
        text="Sign In with Facebook"
        onPress={onSignInFacebook}
        bgColor="#E7EAF4"
        fgColor="#4765A9"
      />

      <Custombutton
        text="Sign In with Google"
        onPress={onSignInGoogle}
        bgColor="#FAE9EA"
        fgColor="#DD4D44"
      />

      <Custombutton
        text="Sign In with Apple"
        onPress={onSignInApple}
        bgColor="#e3e3e3"
        fgColor="#363636"
      />
    </>
  );
};

export default SocialSignInbuttons;

const styles = StyleSheet.create({});
