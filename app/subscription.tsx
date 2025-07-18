import React, { useEffect } from "react";
import { FlatList, Switch, Text, TextInput, View } from "react-native";
import { useDataStore } from "~/store/dataStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Camera } from "lucide-react-native";

const Subscription = () => {
  const { subscription, getAllsubscription, updateSubscription } =
    useDataStore();

  useEffect(() => {
    getAllsubscription();
  }, []);

  const searchSub = (text: string) => {
    console.log(text);
  };

  const changeNotification = (value: boolean, id: string) => {
    const sub = subscription.find((s) => s.subscription_id === id);
    if (sub) {
      updateSubscription({ ...sub, subscription_notification: value });
    }
  };

  return (
    <View className="p-5 ">
      <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-5 mb-4">
        <FontAwesome name="search" size={20} color="#888" />
        <TextInput
          onChangeText={searchSub}
          className="flex-1 ml-2 text-base"
          placeholder="Search subscriptions..."
          placeholderTextColor="#888"
        />
      </View>

      <FlatList
        data={subscription}
        renderItem={({ item }) => {
          return (
            <View className="flex-row items-center gap-5">
              <Camera fill="red" className="size-15" size={75} />;
              <View className="flex-1">
                <Text className="text-lg font-semibold capitalize">
                  {item.subscription_name}
                </Text>
                <Text className="text-gray-400">
                  ${item.subscription_amount} {" / "} {item.subscription_type}
                </Text>
              </View>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                ios_backgroundColor="#3e3e3e"
                onValueChange={(value) =>
                  changeNotification(value, item.subscription_id!)
                }
                value={item.subscription_notification ?? false}
              />
            </View>
          );
        }}
        keyExtractor={(item) => item.subscription_name}
      />
    </View>
  );
};

export default Subscription;
