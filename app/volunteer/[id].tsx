import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";

const API_URL = "http://127.0.0.1:5000/api";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  approved: boolean;
}

export default function VolunteerProfile() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const loadUser = async () => {
      try {
        const res = await fetch(`${API_URL}/volunteers/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load profile");
        }

        setUser(data.user);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [id]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  if (error || !user) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ color: "red" }}>{error || "User not found"}</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        {user.fullName}
      </Text>

      <Text style={{ marginTop: 8 }}>{user.email}</Text>

      <Text style={{ marginTop: 8 }}>
        Role: {user.role}
      </Text>

      <Text style={{ marginTop: 8 }}>
        Status: {user.approved ? "Approved ✅" : "Pending ⏳"}
      </Text>
    </View>
  );
}
