import React from "react";
import { NavigationContainerRef } from "@react-navigation/native";

export const navigationRef = React.createRef();

export function navigate(name, params) {
  if (navigationRef.current && navigationRef.current.isReady()) {
    navigationRef.current.navigate(name, params);
  }
}
