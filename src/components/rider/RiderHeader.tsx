import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import * as Location from "expo-location";
import React, { useEffect } from "react";
import { Alert, Image, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "../../service/authService";
import { useWS } from "../../service/WSProvider";
import { useRiderStore } from "../../store/riderStore";
import { commonStyles } from "../../styles/commonStyles";
import { riderStyles } from "../../styles/riderStyles";
import { Colors } from "../../utils/Constants";
import CustomText from "../shared/customText";

const RiderHeader = () => {
  const isFocused = useIsFocused();
  const { emit, disconnect } = useWS();
  const { onDuty, setLocation, setOnDuty } = useRiderStore();

  const handleLogout = () => {
  Alert.alert(
    "Confirm Logout",
    "Are you sure you want to logout?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => logout(disconnect),
      },
    ],
    { cancelable: true }
  );
};

  const toggleOnDuty = async () => {
    if (onDuty) {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Denied",
          "Location permission is required to go on duty.",
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude, heading } = location.coords;
      setLocation({
        latitude,
        longitude,
        address: "Somewhere",
        heading: heading as number,
      });

      emit("goOnDuty", {
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
        heading: heading,
      });
    } else {
      emit("goOffDuty");
    }
  };

  useEffect(() => {
    if (isFocused) {
      toggleOnDuty();
    }
  }, [onDuty, isFocused]);

  return (
    <>
      <View style={riderStyles.headerContainer}>
        <SafeAreaView />

        <View style={commonStyles.flexRowBetween}>
          <AntDesign
            name="poweroff"
            size={RFValue(15)}
            color={Colors.text}
            onPress={handleLogout}
          />

          <TouchableOpacity
            style={riderStyles.toggleContainer}
            onPress={() => setOnDuty(!onDuty)}
          >
            <CustomText
              fontFamily="SemiBold"
              fontSize={12}
              style={{ color: "#888" }}
            >
              {onDuty ? "ON-DUTY" : "OFF-DUTY"}
            </CustomText>
            <Image
              source={
                onDuty
                  ? require("@/assets/icons/switch_on.png")
                  : require("@/assets//icons/switch_off.png")
              }
              style={riderStyles.icon}
            />
          </TouchableOpacity>

          <MaterialIcons name="notifications" size={24} color="black" />
        </View>
      </View>
      <View style={riderStyles?.earningContainer}>
        <CustomText fontSize={13} style={{ color: "#fff" }} fontFamily="Medium">
          Today's Earnings
        </CustomText>
        <View style={commonStyles?.flexRowGap}>
          <CustomText
            fontSize={14}
            style={{ color: "#fff" }}
            fontFamily="Medium"
          >
            NPR. ---
          </CustomText>
          <MaterialIcons name="arrow-drop-down" size={24} color="#fff" />
        </View>
      </View>
    </>
  );
};

export default RiderHeader;
