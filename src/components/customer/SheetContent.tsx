import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { commonStyles } from "../../styles/commonStyles";
import { uiStyles } from "../../styles/uiStyles";
import CustomText from "../shared/customText";

const cubes = [
  { name: "Bike", imageUri: require("@/assets/icons/bike.png") },
  { name: "Auto", imageUri: require("@/assets/icons/auto.png") },
  { name: "Chota Hathi", imageUri: require("@/assets/icons/cab.png") },
  { name: "Parcel", imageUri: require("@/assets/icons/parcel.png") },
];

const SheetContent = () => {
  return (
    <View style={{ height: "100%" }}>
      <TouchableOpacity
        style={uiStyles.searchBarContainer}
        onPress={() => router.navigate("/customer/selectlocations")}
      >
        <Ionicons name="search-outline" size={RFValue(16)} color="black" />
        <CustomText fontFamily="Medium" fontSize={11}>
          Where are you sending the parcel?
        </CustomText>
      </TouchableOpacity>

      <View style={commonStyles.flexRowBetween}>
        <CustomText fontFamily="Medium" fontSize={11}>
          Explore
        </CustomText>
      </View>

      <View style={uiStyles.cubes}>
        {cubes?.slice(0, 4).map((item, index) => (
          <TouchableOpacity
            style={uiStyles.cubeContainer}
            key={index}
            onPress={() => router.navigate("/customer/selectlocations")}
          >
            <View style={uiStyles.cubeContainer}>
              <Image source={item?.imageUri} style={uiStyles.cubeIcon} />
            </View>
            <CustomText
              fontFamily="Medium"
              fontSize={9.5}
              style={{ textAlign: "center" }}
            >
              {item?.name}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SheetContent;
