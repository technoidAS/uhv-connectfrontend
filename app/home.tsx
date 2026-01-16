import { API_URL } from "@/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const res = await fetch(`${API_URL}/volunteers/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();
        setUser(data.profile);
      } catch (err) {
        console.error("Profile load error:", err);
        setError(err instanceof Error ? err.message : "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
    router.replace("/login");
  };

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text style={{ color: "red" }}>Error: {error}</Text>;

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
