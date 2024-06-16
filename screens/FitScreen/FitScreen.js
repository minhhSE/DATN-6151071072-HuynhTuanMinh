import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useContext } from "react";
import { FitnessItems } from "../../Context";
import { useEffect } from "react";
const FitScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [index, setIndex] = useState(0);
  const excersise = route.params.excersises;
  const current = excersise[index];

  const {
    completed,
    setCompleted,
    workout,
    setWorkout,
    minutes,
    setMinutes,
    calories,
    setCalories,
  } = useContext(FitnessItems);
  console.log(completed, "completed excersise");

  const markAsCompleted = (exerciseName) => {
    setCompleted((prevCompleted) => {
      if (!prevCompleted.includes(exerciseName)) {
        return [...prevCompleted, exerciseName];
      }
      return prevCompleted;
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Image style={styles.image} source={{ uri: current.image }} />

      <Text style={styles.name}>{current.name}</Text>

      <Text style={styles.set}>x{current.sets}</Text>
      {index + 1 >= excersise.length ? (
        <Pressable
          onPress={() => {
            setWorkout(workout + 1);
            setCalories(calories + current.kcal);
            markAsCompleted(current.name);
            navigation.navigate("Home");
          }}
          style={styles.brButton}
        >
          <Text style={styles.button}>DONE</Text>
        </Pressable>
      ) : (
        <Pressable
          onPress={() => {
            navigation.navigate("Rest");
            setCompleted([...completed, current.name]);
            setWorkout(workout + 1);
            setCalories(calories + current.kcal);
            setTimeout(() => {
              setIndex(index + 1);
            }, 2000);
          }}
          style={styles.brButton}
        >
          <Text style={styles.button}>DONE</Text>
        </Pressable>
      )}

      <Pressable style={styles.brbPrevSkip}>
        <Pressable
          disabled={index === 0}
          onPress={() => {
            setTimeout(() => {
              setIndex(index - 1);
            });
          }}
          style={styles.brbPrev}
        >
          <Text style={styles.bPrev}> PREV</Text>
        </Pressable>
        {index + 1 >= excersise.length ? (
          <Pressable
            onPress={() => {
              navigation.navigate("Home");
            }}
            style={styles.brbPrev}
          >
            <Text style={styles.bPrev}>SKIP</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => {
              setTimeout(() => {
                setIndex(index + 1);
              });
            }}
            style={styles.brbPrev}
          >
            <Text style={styles.bPrev}>SKIP</Text>
          </Pressable>
        )}
      </Pressable>
    </ScrollView>
  );
};

export default FitScreen;

const styles = StyleSheet.create({
  container: {
    margintop: 50,
  },
  image: {
    width: "100%",
    height: 370,
  },
  name: {
    fontSize: 30,
    fontWeight: "bold",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 20,
  },
  set: {
    fontSize: 38,
    fontWeight: "bold",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 15,
  },
  brButton: {
    backgroundColor: "blue",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 15,
    borderRadius: 20,
    padding: 10,
    width: 150,
  },
  button: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 20,
    color: "white",
  },
  brbPrevSkip: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 25,
  },
  brbPrev: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 25,
    width: 100,
  },
  bPrev: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
    textAlign: "center",
  },
});
