import { useAuth } from "@/providers/authProvider";
import { Redirect, Stack } from "expo-router";
import { useAnimatedValue } from "react-native";

export default function AuthLAyout() {
    const {isAuthenticated} = useAuth();

    if(isAuthenticated){
        return(
            <Redirect href="/(tabs)" />
        )
    }
    return(
        <Stack />
    )
}