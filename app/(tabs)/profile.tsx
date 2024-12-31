import { Text, View, Image, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import Button from '@/components/Button';
import { supabase } from '@/lib/superbase';
import { useAuth } from '@/providers/authProvider';
import CustomTextInput from '@/components/CustomeTextInput';
import { cld, uploadImage } from '@/lib/cloudinary';
import { thumbnail } from '@cloudinary/url-gen/actions/resize';
import { AdvancedImage } from 'cloudinary-react-native';

export default function ProfileScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [remoteImage, setRemoteImage] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false); // State to track loading
  const { user } = useAuth();

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    setLoading(true); // Start loading
    if (!user) {
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      Alert.alert('Failed to fetch profile');
    } else {
      setUsername(data.username);
      setBio(data.bio);
      setRemoteImage(data.avatar_url);
    }
    setLoading(false); // End loading
  };

  const updateProfile = async () => {
    setLoading(true); // Start loading
    if (!user) {
      setLoading(false);
      return;
    }

    const updatedProfile: any = {
      username,
      bio,
    };

    if (image) {
      const response = await uploadImage(image);
      updatedProfile.avatar_url = response.public_id;
      console.log('Response is ' + response.public_id);
    }

    const { error } = await supabase
      .from('profiles')
      .update(updatedProfile)
      .eq('id', user.id);

    if (error) {
      Alert.alert('Failed to update profile');
    } else {
      Alert.alert('Profile updated successfully!');
    }
    setLoading(false); // End loading
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  let remoteCldImage;
  if (remoteImage) {
    remoteCldImage = cld.image(remoteImage);
    remoteCldImage.resize(thumbnail().width(300).height(300));
  }

  return (
    <View className="p-3 flex-1">
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          {/* Avatar image picker */}
          {image ? (
            <Image
              source={{ uri: image }}
              className="w-52 aspect-square self-center rounded-full bg-slate-300"
            />
          ) : remoteCldImage ? (
            <AdvancedImage
              cldImg={remoteCldImage}
              className="w-52 aspect-square self-center rounded-full bg-slate-300"
            />
          ) : (
            <View className="w-52 aspect-square self-center rounded-full bg-slate-300" />
          )}
          <Text
            onPress={pickImage}
            className="text-blue-500 font-semibold m-5 self-center"
          >
            Change
          </Text>

          {/* Form */}
          <View className="gap-5">
            <CustomTextInput
              label="Username"
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />

            <CustomTextInput
              label="Bio"
              placeholder="Bio"
              value={bio}
              onChangeText={setBio}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Button */}
          <View className="gap-2 mt-auto">
            <Button title="Update profile" onPress={updateProfile} />
            <Button title="Sign out" onPress={() => supabase.auth.signOut()} />
          </View>
        </>
      )}
    </View>
  );
}
