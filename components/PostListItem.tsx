import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { View, Image, Text, useWindowDimensions } from "react-native";
import posts from "../assets/data/posts.json";
import { cld } from "@/lib/cloudinary";
import { AdvancedImage } from "cloudinary-react-native";

import { thumbnail } from "@cloudinary/url-gen/actions/resize";
import { byRadius } from "@cloudinary/url-gen/actions/roundCorners";
import { focusOn } from "@cloudinary/url-gen/qualifiers/gravity";
import { FocusOn } from "@cloudinary/url-gen/qualifiers/focusOn";

export default function PostListItem(props: { post: any }) {
  const post = props.post;
  const { width } = useWindowDimensions();
  // const myImage = cld.image('samples/people/boy-snow-hoodie');
  const myImage = cld.image(post.image);
  myImage.resize(thumbnail().width(Math.round(width)).height(Math.round(width)));

  // .resize(thumbnail().width(150).height(150).gravity(focusOn(FocusOn.face())))  // Crop the image, focusing on the face.
  // .roundCorners(byRadius(100));    // Round the corners.
  // console.log(post.user.avatar_url);
  const avatar = cld.image(post.user.avatar_url || 'user_jwt8xs');
  // console.log(avatar)
  avatar.resize(
    thumbnail().width(49).height(48)
    // thumbnail().width(49).height(48).gravity(focusOn(FocusOn.face()))
  );

  return (
    <View className="bg-white">
      {/* Header */}
      <View className="flex-row items-center p-2">
        <AdvancedImage cldImg={avatar} className="w-12 h-12 rounded-full" />
        <Text className="ml-2 text-lg font-semibold">{post.user.username || 'New User'}</Text>
      </View> 

      {/* {console.log(post1.image_url)} */}
      {/* Post Image */}
      {/* <AdvancedImage cldImg={myImage}  className="w-full aspect-video" fallback={<Text>Image loading...</Text>} /> */}

      <AdvancedImage
        cldImg={myImage}
        className="w-full aspect-video"
      />

      {/* <Image
          source={{ uri: post.image_url}}
          className="w-full aspect-video"
        /> */}

      {/* Action Row */}
      <View className="flex-row items-center gap-4 p-3">
      <AntDesign name="hearto" size={24} color="black" />
        <Ionicons name="chatbubble-outline" size={20} color="black" />
        <Feather name="send" size={20} color="black" />
        <Feather name="bookmark" size={20} className="ml-auto" />
      </View>

      {/* Optional Likes Section */}
      {/* <View className="px-3 gap-1">
          <Text className="font-semibold">{post1.likes?.[0]?.count || 0} likes</Text>
          <Text>
            <Text className="font-semibold">{post1.user.username || "New user"} </Text>
            {post1.caption}
          </Text>
        </View> */}
    </View>
  );
}
