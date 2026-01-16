import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Link, useRouter, router } from "expo-router";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      const res = await fetch("http://localhost:5000/api/volunteers/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setUser(data.profile);
    };

    loadProfile();
  }, []);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
    router.replace("/login");
  };

  if (!user) return <Text>Loading...</Text>;

  return (
    <View style={{ padding: 20 }}>
      <Link href="/feed">
        <Text style={{ color: "blue", marginBottom: 10 }}>Go to Feed</Text>
      </Link>

      <Text style={{ fontSize: 22, fontWeight: "bold" }}>
        Welcome {user.fullName}
      </Text>
      <Text>{user.email}</Text>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={logout}
        style={{
          marginTop: 30,
          backgroundColor: "#ef4444",
          padding: 12,
          borderRadius: 6,
        }}
      >
        <Text style={{ color: "white", textAlign: "center", fontSize: 16 }}>
          Logout
        </Text>
      </TouchableOpacity>

      <Link href="/edit-profile">
  <Text>Edit Profile</Text>
</Link>



<TouchableOpacity
  onPress={() =>
    router.push({
      pathname: "/volunteer/[id]",
      params: { id: user._id },
    })
  }
  style={{
    marginTop: 20,
    padding: 12,
    backgroundColor: "#2563eb",
    borderRadius: 6,
  }}
>
  <Text style={{ color: "white", textAlign: "center" }}>
    View My Public Profile
  </Text>
</TouchableOpacity>




    </View>
    
  );
}
