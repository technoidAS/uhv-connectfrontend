import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const API_URL = "http://localhost:5000/api";

export default function EditProfile() {
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/volunteers/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setFullName(data.profile.fullName);
    };

    loadProfile();
  }, []);

  const saveProfile = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await fetch(`${API_URL}/volunteers/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          ...(password ? { password } : {}),
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      Alert.alert("Success", "Profile updated");
      router.back();
    } catch {
      Alert.alert("Error", "Could not update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, marginBottom: 20 }}>Edit Profile</Text>

      <Text>Full Name</Text>
      <TextInput
        value={fullName}
        onChangeText={setFullName}
        style={{ borderWidth: 1, padding: 10, marginBottom: 15 }}
      />

      <Text>New Password (optional)</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <TouchableOpacity onPress={saveProfile} disabled={loading}>
        <Text style={{ color: "blue", fontSize: 18 }}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}
