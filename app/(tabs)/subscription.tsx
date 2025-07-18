import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useDataStore } from "~/store/dataStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";

const Subscription = () => {
  const { subscription, getAllsubscription } = useDataStore();

  useEffect(() => {
    getAllsubscription();
  }, []);

  console.log("All the subscription", subscription);

  return (
    <View className="p-5">
      <Text>setting</Text>
    </View>
  );
};

export default Subscription;
