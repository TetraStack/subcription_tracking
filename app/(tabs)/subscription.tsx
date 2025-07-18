import React, { useEffect, useState } from "react";
import { FlatList, Switch, Text, TextInput, View } from "react-native";
import { useDataStore } from "~/store/dataStore";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Camera,
  Check,
  Info,
  Landmark,
  MoonStar,
  Sun,
  Target,
  TvMinimalPlayIcon,
} from "lucide-react-native";
import { Subscriptions } from "~/types/subscription";

const Subscription = () => {
  const { subscription, getAllsubscription, updateSubscription } =
    useDataStore();

  const [searchText, setSearchText] = useState("");

  const [localNotifications, setLocalNotifications] = useState<{
    [id: string]: boolean;
  }>({});

  useEffect(() => {
    getAllsubscription();
  }, []);

  useEffect(() => {
    const notifs: { [id: string]: boolean } = {};
    subscription.forEach((sub) => {
      if (sub.subscription_id) {
        notifs[sub.subscription_id] = sub.subscription_notification ?? false;
      }
    });
    setLocalNotifications(notifs);
  }, [subscription]);

  const filtered = searchText
    ? subscription.filter((sub) =>
        sub.subscription_name.toLowerCase().includes(searchText.toLowerCase())
      )
    : subscription;

  const changeNotification = (value: boolean, id: string) => {
    setLocalNotifications((prev) => ({
      ...prev,
      [id]: value,
    }));
    const sub = subscription.find((s) => s.subscription_id === id);
    if (sub) {
      updateSubscription({ ...sub, subscription_notification: value });
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case "entertainment":
        return <TvMinimalPlayIcon size={40} />;
      case "productivity":
        return <Target size={40} />;
      case "utilities":
        return <MoonStar size={40} />;
      case "finance":
        return <Landmark size={40} />;
      default:
        return <Info size={40} />;
    }
  };

  return (
    <View className="p-5 ">
      <View className="flex-row items-center bg-gray-100 rounded-xl px-3 py-5 mb-4">
        <FontAwesome name="search" size={20} color="#888" />
        <TextInput
          onChangeText={setSearchText}
          className="flex-1 ml-2 text-base"
          placeholder="Search subscriptions..."
          placeholderTextColor="#888"
        />
      </View>

      <FlatList
        data={filtered}
        renderItem={({ item }) => {
          return (
            <View className="flex-row items-center gap-5  my-5">
              {getCategoryIcon(item.subscription_category)}
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
                value={localNotifications[item.subscription_id!] ?? false}
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
