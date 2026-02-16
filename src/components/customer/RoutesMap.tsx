import { MaterialCommunityIcons } from "@expo/vector-icons";
import React, { FC, memo, useEffect, useRef } from "react";
import { Image, TouchableOpacity, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { RFValue } from "react-native-responsive-fontsize";
import { mapStyles } from "../../styles/mapStyles";
import { customMapStyle, nepalInitialRegion } from "../../utils/CustomMap";

const apikey = process.env.EXPO_PUBLIC_MAP_API_KEY || "";

const RoutesMap: FC<{ drop: any; pickup: any }> = ({ drop, pickup }) => {
  const mapRef = useRef<MapView>(null);

  const fitToMarkers = async () => {
    const coordinates = [];
    if (pickup?.latitude && pickup?.longitude) {
      coordinates.push({
        latitude: pickup.latitude,
        longitude: pickup.longitude,
      });
    }

    if (drop?.latitude && drop?.longitude) {
      coordinates.push({
        latitude: drop.latitude,
        longitude: drop.longitude,
      });
    }

    if (coordinates.length === 0) return;

    try {
      mapRef.current?.fitToCoordinates(coordinates, {
        edgePadding: {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50,
        },
        animated: true,
      });
    } catch (error) {
      console.log("Error fitting", error);
    }
  };

  const fitToMarkersWithDelay = () => {
    setTimeout(() => {
      fitToMarkers();
    }, 500);
  };

  useEffect(() => {
    if (drop?.latitude && pickup?.latitude && mapRef) {
      fitToMarkersWithDelay();
    }
  }, [drop?.latitude, pickup?.latitude, mapRef]);

  const calculateInitialRegion = () => {
    if (pickup?.latitude && drop?.latitude) {
      const latitude = (pickup.latitude + drop.latitude) / 2;
      const longitude = (pickup.longitude + drop.longitude) / 2;

      return {
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      };
    }

    // Fallback region (e.g., default to Kathmandu)
    return nepalInitialRegion;
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        followsUserLocation={true}
        style={{ flex: 1 }}
        initialRegion={calculateInitialRegion()}
        // provider="google"
        showsMyLocationButton={false}
        showsCompass={false}
        showsIndoorLevelPicker={false}
        customMapStyle={customMapStyle}
        showsUserLocation={true}
      >
        {pickup?.latitude && drop?.latitude && (
          <MapViewDirections
            origin={pickup}
            destination={drop}
            apikey={apikey}
            strokeWidth={5}
            precision="high"
            onReady={() => fitToMarkersWithDelay()}
            strokeColor="#D2D2D2"
            strokeColors={["#D2D2D2"]}
            onError={(err) => console.log("Directions Error", err)}
          />
        )}
        {drop?.latitude && (
          <Marker
            coordinate={{ latitude: drop.latitude, longitude: drop.longitude }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={1}
          >
            <Image
              source={require("@/assets/icons/drop_marker.png")}
              style={{ height: 30, width: 30, resizeMode: "contain" }}
            />
          </Marker>
        )}

        {pickup?.latitude && (
          <Marker
            coordinate={{
              latitude: pickup.latitude,
              longitude: pickup.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            zIndex={2}
          >
            <Image
              source={require("@/assets/icons/marker.png")}
              style={{
                height: 30,
                width: 30,
                resizeMode: "contain",
              }}
            />
          </Marker>
        )}
      </MapView>

      <TouchableOpacity style={mapStyles.gpsButton} onPress={fitToMarkers}>
        <MaterialCommunityIcons
          name="crosshairs-gps"
          size={RFValue(16)}
          color={"#3C75B3"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default memo(RoutesMap);
