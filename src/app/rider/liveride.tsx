import { useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { Alert, View } from "react-native";
import OtpInputModal from "../../components/rider/OtpInputModal";
import RiderActionButton from "../../components/rider/RiderActionButton";
import RiderLiveTracking from "../../components/rider/RiderLiveTracking";
import { updateRideStatus } from "../../service/rideService";
import { useWS } from "../../service/WSProvider";
import { useRiderStore } from "../../store/riderStore";
import { rideStyles } from "../../styles/rideStyles";
import { resetAndNavigate } from "../../utils/Helpers";

const Liveride = () => {
  const [isOtpModalVisible, setOtpModalVisible] = useState(false);
  const [rideData, setRideData] = useState<any>(null);
  const { setLocation, location, setOnDuty } = useRiderStore();
  const { emit, on, off } = useWS();
  const route = useRoute() as any;
  const params = route?.params || {};
  const id = params.id;

  useEffect(() => {
    let locationSubscription: any;
    const startLocationUpdates = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status === "granted") {
        locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 2,
          },
          (location) => {
            const { latitude, longitude, heading } = location.coords;

            setLocation({
              latitude: latitude,
              longitude: longitude,
              address: "Somewhere",
              heading: heading as number,
            });

            setOnDuty(true);

            emit("goOnDuty", {
              latitude: location.coords.latitude,
              longitude: location.coords.latitude,
              heading: heading as number,
            });

            emit("updateLocation", { latitude, longitude, heading });

            console.log(
              `Location updated: Lat ${latitude}, Lon ${longitude}, Heading: ${heading}`,
            );
          },
        );
      } else {
        console.log("Location permission denied");
      }
    };

    startLocationUpdates();

    return () => {
      if (locationSubscription) {
        locationSubscription.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (id) {
      emit("subscribeRide", id);
      on("rideData", (data) => {
        setRideData(data);
      });

      on("rideUpdate", (data) => {
        setRideData(data);
      });

      on("rideCanceled", (error) => {
        resetAndNavigate("/rider/home");
        Alert.alert("Ride Canceled");
      });

      on("error", (error) => {
        resetAndNavigate("/rider/home");
        Alert.alert("Oh Dang! Error Found");
      });
    }

    return () => {
      off("rideData");
      off("rideUpdate");
      off("rideCanceled");
      off("error");
    };
  }, [id, emit, on, off]);

  return (
    <View style={rideStyles.container}>
      <StatusBar style="light" backgroundColor="orange" translucent={false} />

      {rideData && (
        <RiderLiveTracking
          status={rideData?.status}
          drop={{
            latitude: parseFloat(rideData?.drop?.latitude),
            longitude: parseFloat(rideData?.drop?.longitude),
          }}
          pickup={{
            latitude: parseFloat(rideData?.pickup?.latitude),
            longitude: parseFloat(rideData?.pickup?.longitude),
          }}
          rider={{
            latitude: location?.latitude,
            longitude: location?.longitude,
            heading: location?.heading,
          }}
        />
      )}

      <RiderActionButton
        ride={rideData}
        title={
          rideData?.status === "START"
            ? "ARRIVED"
            : rideData?.status === "ARRIVED"
              ? "COMPLETE RIDE"
              : "SUCCESS"
        }
        onPress={async () => {
          if (rideData?.status === "START") {
            setOtpModalVisible(true);
            return;
          }

          const isSuccess = await updateRideStatus(rideData?._id, "COMPLETED");
          if (isSuccess) {
            Alert.alert("Congratulations! You rock!");
            resetAndNavigate("/rider/home");
          } else {
            Alert.alert("There was an error");
          }
        }}
        color="#228B22"
      />

      {isOtpModalVisible && (
        <OtpInputModal
          visible={isOtpModalVisible}
          onClose={() => setOtpModalVisible(false)}
          title="Enter OTP Below"
          onConfirm={async (otp) => {
            if (otp === rideData?.otp) {
              const isSuccess = await updateRideStatus(
                rideData?._id,
                "ARRIVED",
              );
              if (isSuccess) {
                setOtpModalVisible(false);
              } else {
                Alert.alert("Technical Error");
              }
            } else {
              Alert.alert("Wrong OTP");
            }
          }}
        />
      )}
    </View>
  );
};

export default Liveride;
