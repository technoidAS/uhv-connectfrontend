import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { router } from "expo-router";

const API_URL = "http://localhost:5000/api";

interface User {
  _id: string;
  fullName: string;
  email: string;
}

export default function SearchUsers() {
  const [q, setQ] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  const search = async () => {
    const res = await fetch(`${API_URL}/volunteers/search?q=${q}`);
    const data = await res.json();
    setUsers(data.users);
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Search users"
        value={q}
        onChangeText={setQ}
        style={{ borderWidth: 1, padding: 10 }}
      />

      <TouchableOpacity onPress={search}>
        <Text style={{ marginVertical: 10 }}>Search</Text>
      </TouchableOpacity>

      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push({
             pathname: "/volunteer/[id]",
              params: { id: item._id },
            })}
          >
            <Text>{item.fullName}</Text>
            <Text style={{ fontSize: 12 }}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
