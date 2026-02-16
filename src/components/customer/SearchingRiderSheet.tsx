import { FC } from "react";
import { ActivityIndicator, Image, TouchableOpacity, View } from "react-native";
import { useWS } from "../../service/WSProvider";
import { commonStyles } from "../../styles/commonStyles";
import { rideStyles } from "../../styles/rideStyles";
import { vehicleIcons } from "../../utils/mapUtils";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import CustomText from "../shared/customText";

type VehicleType = "bike" | "auto" | "cabEconomy" | "cabPremium";

interface RideItem {
  vehicle?: VehicleType;
  _id: string;
  pickup?: { address: string };
  drop?: { address: string };
  fare?: number;
}

const SearchingRideSheet: FC<{ item: RideItem }> = ({ item }) => {
  const { emit } = useWS();

  return (
    <View>
      <View style={rideStyles?.headerContainer}>
        <View style={commonStyles.flexRowBetween}>
          {item?.vehicle && (
            <Image
              source={vehicleIcons[item.vehicle]?.icon}
              style={rideStyles?.rideIcon}
            />
          )}
          <View style={{ marginLeft: 10 }}>
            <CustomText fontSize={10}>Looking for your</CustomText>
            <CustomText fontFamily="Medium" fontSize={12}>
              {item?.vehicle} ride
            </CustomText>
          </View>
        </View>
        <ActivityIndicator color="black" size="small" />
      </View>

      <View style={{ marginVertical: 20 }}>
        <View style={commonStyles.flexRowBetween}>
          <View style={commonStyles.flexRow}>
            <MaterialCommunityIcons
              name="credit-card"
              size={24}
              color="black"
            />
            <CustomText
              style={{ marginLeft: 10 }}
              fontFamily="SemiBold"
              fontSize={12}
            >
              Payment
            </CustomText>
          </View>

          <CustomText fontFamily="SemiBold" fontSize={14}>
            ${item?.fare?.toFixed(2)}
          </CustomText>
        </View>

        <CustomText fontSize={10}>Payment via cash</CustomText>
      </View>

      <View style={rideStyles?.bottomButtonContainer}>
        <TouchableOpacity
          style={rideStyles?.cancelButton}
          onPress={() => {
            emit("cancelRide", item?._id);
          }}
        >
          <CustomText style={rideStyles?.cancelButtonText}>Cancel</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          style={rideStyles?.backButton2}
          onPress={() => router.back()}
        >
          <CustomText style={rideStyles?.backButtonText}>Back</CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchingRideSheet;
