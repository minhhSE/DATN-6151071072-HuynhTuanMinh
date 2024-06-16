import React, { createContext, useState } from "react";

const FitnessItems = createContext();

const FitnessConText = ({ children }) => {
  const [completed, setCompleted] = useState([]);
  const [workout, setWorkout] = useState(0);
  const [calories, setCalories] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const resetValues = () => {
    setWorkout(0);
    setMinutes(0);
    setCalories(0);
    setCompleted([]);
  };

  return (
    <FitnessItems.Provider
      value={{
        completed,
        setCompleted,
        workout,
        setWorkout,
        calories,
        setCalories,
        minutes,
        setMinutes,
        resetValues,
      }}
    >
      {children}
    </FitnessItems.Provider>
  );
};

export { FitnessConText, FitnessItems };
