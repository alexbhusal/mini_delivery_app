import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "../../components/customButton";
import CustomText from "../../components/shared/customText";
import PhoneInput from "../../components/shared/phoneInput";
import { signin } from "../../service/authService";
import { useWS } from "../../service/WSProvider";
import { authStyles } from "../../styles/authStyles";
import { commonStyles } from "../../styles/commonStyles";

const Auth = () => {
  const { updateAccessToken } = useWS();
  const [phone, setPhone] = useState("");

  const handleNext = async () => {
    if (!phone && phone.length !== 10) {
      Alert.alert("Must be 10 DIGIT");
      return;
    }
    signin({ role: "rider", phone }, updateAccessToken);
  };
  return (
    <SafeAreaView style={authStyles.container}>
      <ScrollView contentContainerStyle={authStyles.container}>
        <View style={commonStyles.flexRowBetween}>
          <Image
            source={require("@/assets/images/rider_logo.png")}
            style={authStyles.logo}
          />
          <TouchableOpacity style={authStyles.flexRowGap}>
            <MaterialIcons name="help" size={18} color={"grey"}></MaterialIcons>
            <CustomText fontFamily="Medium" variant="h7">
              Help
            </CustomText>
          </TouchableOpacity>
        </View>

        <CustomText fontFamily="Medium" variant="h7">
          What's your Number Rider
        </CustomText>
        <CustomText
          fontFamily="Medium"
          variant="h7"
          style={commonStyles.lightText}
        >
          Enter Phone Number
        </CustomText>
        <PhoneInput onChangeText={setPhone} value={phone} />
      </ScrollView>

      <View style={authStyles.footerContainer}>
        <CustomText
          variant="h8"
          fontFamily="Regular"
          style={[
            commonStyles.lightText,
            { textAlign: "center", marginHorizontal: 20 },
          ]}
        >
          By Continue Agreed
        </CustomText>
        <CustomButton
          title="Next"
          onPress={handleNext}
          loading={false}
          disabled={false}
        ></CustomButton>
      </View>
    </SafeAreaView>
  );
};

export default Auth;
