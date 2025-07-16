import { useEffect } from "react";
import { Text, View } from "react-native";
import List from "~/components/List";
import Stats from "~/components/Stats";
import { useDataStore } from "~/store/dataStore";

export default function Index() {
  const { subscription, getAllsubscription } = useDataStore();

  useEffect(() => {
    getAllsubscription();
  }, []);

  return (
    <View className="flex justify-center bg-white items-center">
      <View className="m-4">
        <Stats subscriptions={subscription} />
      </View>
      <View>
        <List subscriptions={subscription} />
      </View>
    </View>
  );
}
