import React, { useEffect, useState } from "react";
import { Text, View, Image, TextInput, Pressable } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Button from "@/components/Button";
import { cld, uploadImage } from "@/lib/cloudinary";
import { supabase } from "@/lib/superbase";
import { useAuth } from "@/providers/authProvider";
import { useRouter } from "expo-router";

const Create = () => {
  const router=useRouter();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState<string>("");

  const { session } = useAuth();
  useEffect(() => {
    if (!image) {
      pickImage();
    }
  }, []);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images", "videos"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    // console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const createPost = async () => {
    // Upload the image to Cloudinary
    if (!image) {
      console.log("No image selected.");
      return;
    }
  
    const response = await uploadImage(image);
    console.log("Cloudinary Response: ", response);
  
    if (!response?.public_id) {
      console.log("Image upload failed.");
      return;
    }
  
    // Save the post to the database
    if (!session?.user?.id) {
      console.log("User is not authenticated.");
      return;
    }
  
    const { data, error } = await supabase
      .from("Postss") // Ensure table name is correct
      .insert([
        {
          caption,
          image: response.public_id,
          user_id: session.user.id,
        },
      ])
      .select();
  
    if (error) {
      // console.log("Supabase Error:", error.message);
      return;
    }
  
    // console.log("Post created successfully:", data);
  
    // console.log("Supabase Query:", {
    //   caption,
    //   image: response.public_id,
    //   user_id: session?.user?.id,
    // });
    
    // Navigate back to the main screen
    router.push("/(tabs)");
  };
  
  return (
    <View className="p-3 items-center flex-1">
      {/* Image Picker */}
      {image ? (
        <Image
          source={{ uri: image }}
          className="w-52 aspect-[3/4] rounded-lg"
        />
      ) : (
        <View className="w-52 aspect-[3/4] rounded-lg" />
      )}
      <Text onPress={pickImage} className="text-blue-500 font-semibold m-5">
        Change
      </Text>

      {/* Text Input for Caption */}
      <TextInput
        value={caption}
        onChangeText={(newValue) => setCaption(newValue)}
        placeholder="What is on your mind"
        className="w-full p-3"
      />

      {/* Button */}
      <View className="mt-auto w-full">
        <Button title="Share" onPress={createPost} />
      </View>
    </View>
  );
};

export default Create;
