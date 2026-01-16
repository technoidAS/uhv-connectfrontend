import AsyncStorage from "@react-native-async-storage/async-storage";
import { Redirect } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [ready, setReady] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      setLoggedIn(!!token);
      setReady(true);
    });
  }, []);

  if (!ready) return null;

  return loggedIn ? <Redirect href="/home" /> : <Redirect href="/login" />;
}
