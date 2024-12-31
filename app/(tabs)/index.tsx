import { Image, Text, View, FlatList, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import posts from "../../assets/data/posts.json";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/superbase";
import PostListItem from "@/components/PostListItem";

const post1 = posts[2];

export default function Index() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    let { data, error } = await supabase.from("Postss").select('*, user:profiles(*)');
    if(error){
      Alert.alert('something Went wrong')
    }
    setPosts(data);
  };

  // console.log(posts);
  useEffect(() => {
    fetchPosts();
  });
  // console.log(posts);
  return (
    //  <View>
    //   <PostListItem post={post1}/>
    //  </View>

    <FlatList
      showsVerticalScrollIndicator={false}
      data={posts}
      contentContainerStyle={{
        gap: 10,
        maxWidth: 512,
        width: "100%",
        alignSelf: "center",
      }}
      renderItem={({ item }) => <PostListItem post={item}></PostListItem>}
      // className="items-center"
    />
  );
}
function fetchPosts() {
  throw new Error("Function not implemented.");
}

