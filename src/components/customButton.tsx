import React, { FC } from "react";
import {
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Colors } from "../utils/Constants";
import { CustomButtonProps } from "../utils/types";
import CustomText from "./shared/customText";

const CustomButton: FC<CustomButtonProps> = ({
  onPress,
  title,
  disabled,
  loading,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      disabled={disabled || loading}
      style={[
        styles.container,
        {
          backgroundColor: disabled ? Colors.secondary : Colors.primary,
        },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.text} size={"small"} />
      ) : (
        <CustomText
          fontFamily="SemiBold"
          style={{
            fontSize: RFValue(12),
            color: disabled ? "#fff" : Colors.text,
          }}
        >
          {title}
        </CustomText>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    margin: 10,
    padding: 10,
    height: 45,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

export default CustomButton;
