import React from "react"
import { Text,TextInput } from "react-native";
export default function CustomTextInput({label,...textInputProps}) { 
    return(
        <>
        <Text className="text-gray-500 font-semibold">{label}</Text>
        <TextInput
            {...textInputProps} />
        </>
    )
}


