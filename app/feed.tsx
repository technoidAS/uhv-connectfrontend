import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../config";



const API = "http://localhost:5000/api";


export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  const loadFeed = async () => {
    
    const token = await AsyncStorage.getItem("token");
    console.log(token);
    const res = await fetch(`${API_URL}/feed`, {
      headers: { Authorization: `Bearer ${token}` },
    });


    const data = await res.json();
    setPosts(data.posts);
  };

  
//neww

  const createPost = async () => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      alert("Not logged in");
      return;
    }

    if (!content || content.trim() === "") {
      alert("Post content is empty");
      return;
    }

    const res = await fetch(`${API_URL}/feed/post`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: content.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Create post failed:", data);
      alert(data.message || "Failed to create post");
      return;
    }

    console.log("Post created:", data);

    setContent("");
    await loadFeed();
  } catch (err) {
    console.error("Create post error:", err);
    alert("Backend not reachable");
  }
};
//neww

  useEffect(() => {
    loadFeed();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22 }}>Feed</Text>

      <TextInput
        placeholder="Share something…"
        value={content}
        onChangeText={setContent}
      />

      <TouchableOpacity onPress={createPost}>
        <Text>Post</Text>
      </TouchableOpacity>

      {posts.map((p: any) => (
        <View key={p._id} style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>{p.author.fullName}</Text>
          <Text>{p.content}</Text>
        </View>
      ))}
    </View>
  );
}
