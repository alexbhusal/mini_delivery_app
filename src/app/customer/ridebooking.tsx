import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { memo, useCallback, useMemo, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { RFValue } from "react-native-responsive-fontsize";
import CustomButton from "../../components/customButton";
import RoutesMap from "../../components/customer/RoutesMap";
import CustomText from "../../components/shared/customText";
import { createRide } from "../../service/rideService";
import { useUserStore } from "../../store/userStore";
import { commonStyles } from "../../styles/commonStyles";
import { rideStyles } from "../../styles/rideStyles";
import { calculateFare } from "../../utils/mapUtils";

const RideBooking = () => {
  const route = useRoute() as any;
  const item = route?.params as any;
  const { location } = useUserStore() as any;
  const [selectedOption, setSelectedOption] = useState("Bike");
  const [loading, setLoading] = useState(false);

  const farePrices = useMemo(
    () => calculateFare(parseFloat(item?.distanceInKm)),
    [item?.distanceInKm],
  );

  const rideOptions = useMemo(
    () => [
      {
        type: "Bike",
        seats: 1,
        time: "1 min",
        dropTime: "4:28 pm",
        price: farePrices?.bike,
        isFastest: true,
        icon: require("@/assets/icons/bike.png"),
      },
      {
        type: "Auto",
        seats: 3,
        time: "5 min",
        dropTime: "4:38 pm",
        price: farePrices?.auto,
        isFastest: true,
        icon: require("@/assets/icons/auto.png"),
      },
      {
        type: "Chota Hathi",
        seats: 4,
        time: "9 min",
        dropTime: "4:58 pm",
        price: farePrices?.cabEconomy,
        isFastest: true,
        icon: require("@/assets/icons/cab.png"),
      }
    ],
    [farePrices],
  );

  const handleOptionSelect = useCallback((type: string) => {
    setSelectedOption(type);
  }, []);

  const handleRideBooking = async () => {
    setLoading(true);

    await createRide({
      vehicle:
        selectedOption === "Cab Economy"
          ? "cabEconomy"
            : selectedOption === "Bike"
              ? "bike"
              : "auto",
      drop: {
        latitude: parseFloat(item.drop_latitude),
        longitude: parseFloat(item.drop_longitude),
        address: item?.drop_address,
      },
      pickup: {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude),
        address: location?.pickup_address,
      },
    });
    setLoading(false);
  };

  return (
    <View style={rideStyles.container}>
      <StatusBar style="light" backgroundColor="orange" translucent={false} />
      {item?.drop_latitude && location?.latitude && (
        <RoutesMap
          drop={{
            latitude: parseFloat(item?.drop_latitude),
            longitude: parseFloat(item?.drop_longitude),
          }}
          pickup={{
            latitude: parseFloat(location?.latitude),
            longitude: parseFloat(location?.longitude),
          }}
        />
      )}
      <View style={rideStyles.rideSelectionContainer}>
        <ScrollView
          contentContainerStyle={rideStyles?.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {rideOptions?.map((ride, index) => (
            <RideOption
              key={index}
              ride={ride}
              selected={selectedOption}
              onSelect={handleOptionSelect}
            />
          ))}
        </ScrollView>
      </View>
      <TouchableOpacity
        style={rideStyles.backButton}
        onPress={() => router.back()}
      >
        <MaterialIcons
          name="arrow-back-ios"
          size={RFValue(14)}
          style={{ left: 4 }}
          color="black"
        />
      </TouchableOpacity>

      <View style={rideStyles.bookingContainer}>
        <View style={commonStyles.flexRowBetween}>
          <View
            style={[
              rideStyles.couponContainer,
            ]}
          >
            
            <Image
              source={require("@/assets/icons/rupee.png")}
              style={rideStyles?.icon}
            />
           
            <View>
              <CustomText fontFamily="Medium" fontSize={12}>
                Cash
              </CustomText>
              <CustomText
                fontFamily="Medium"
                fontSize={10}
                style={{ opacity: 0.7 }}
              >
                Far:{item?.distance || "----"} Km
              </CustomText>
            </View>
          </View>
        </View>
        <CustomButton
          title="Book"
          disabled={loading}
          loading={loading}
          onPress={handleRideBooking}
        />
      </View>
    </View>
  );
};

const RideOption = memo(({ ride, selected, onSelect }: any) => (
  <TouchableOpacity
    onPress={() => onSelect(ride?.type)}
    style={[
      rideStyles.rideOption,
      { borderColor: selected === ride?.type ? "#222" : "#ddd" },
    ]}
  >
    <View
      style={[
        commonStyles.flexRowBetween,
        { paddingHorizontal: 5, marginHorizontal: 10 },
      ]}
    >
      <Image source={ride?.icon} style={rideStyles.rideIcon} />
      <View style={rideStyles.rideDetails}>
        <CustomText fontFamily="Medium" fontSize={12}>
          {ride?.type}{" "}
          {ride?.isFastest && (
            <Text style={rideStyles.fastestLabel}>Fastest</Text>
          )}
        </CustomText>
      </View>
      <View style={rideStyles?.priceContainer}>
        <CustomText fontFamily="Medium" fontSize={14}>
          Price: {ride?.price?.toFixed(2)}
        </CustomText>
        {selected === ride.type && (
          <Text style={rideStyles?.discountedPrice}>
            #* {(Number(ride?.price) + 10).toFixed(2)}
          </Text>
        )}
      </View>
    </View>
  </TouchableOpacity>
));

export default memo(RideBooking);
