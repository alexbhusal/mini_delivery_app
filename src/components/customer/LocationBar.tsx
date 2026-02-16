import { AntDesign } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, TouchableOpacity, View } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { logout } from "../../service/authService";
import { useWS } from "../../service/WSProvider";
import { useUserStore } from "../../store/userStore";
import { uiStyles } from "../../styles/uiStyles";
import { Colors } from "../../utils/Constants";
import CustomText from "../shared/customText";

const LocationBar = () => {
  const { location } = useUserStore();
  const { disconnect } = useWS();
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


  return (
    <View style={uiStyles.absoluteTop}>
      <SafeAreaView />
      <View style={uiStyles.container}>
        <TouchableOpacity
          style={uiStyles.btn}
          onPress={handleLogout}
        >
          <AntDesign name="poweroff" size={RFValue(12)} color={Colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={uiStyles.locationBar}
          onPress={() => router.navigate("/customer/selectlocations")}
        >
          <View style={uiStyles.dot} />

          <CustomText numberOfLines={1} style={uiStyles.locationText}>
            {location?.address || "Getting address..."}
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LocationBar;
