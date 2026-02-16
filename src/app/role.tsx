import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CustomText from "../components/shared/customText";
import { roleStyles } from "../styles/roleStyles";

const Role = () => {
  const handleCustomerPress = () => {
    router.navigate("/customer/auth");
  };
  const handleRiderPress = () => {
    router.navigate("/rider/auth");
  };

  return (
    <View style={{marginTop:10}}>
      <TouchableOpacity style={[roleStyles.card,{margin:20}]} onPress={handleCustomerPress}>
        <Image
          source={require("@/assets/images/customer.jpg")}
          style={roleStyles.image}
        />
        <View style={roleStyles.cardContent}>
          <CustomText style={roleStyles.title}>Customer</CustomText>
          <CustomText style={roleStyles.description}>
            Are You Customer
          </CustomText>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={[roleStyles.card,{margin:20}]} onPress={handleRiderPress}>
        <Image
          source={require("@/assets/images/rider.jpg")}
          style={roleStyles.image}
        />
        <View style={roleStyles.cardContent}>
          <CustomText style={roleStyles.title}>Rider</CustomText>
          <CustomText style={roleStyles.description}>Are You Rider?</CustomText>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Role;
