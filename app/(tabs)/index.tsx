import { useEffect } from "react";
import { Text, View } from "react-native";
import List from "~/components/List";
import Stats from "~/components/Stats";
import { subscriptions } from "~/data/data";


export default function Index() {
    const { subscription, getAllsubscription } = useDataStore();

    useEffect(() => {
        getAllsubscription();
    }, []);
    return (
        <View
            className="flex items-center justify-center bg-white"
        >
            <View className="m-4">
                <Stats />
            </View>
            <View>
                <List subscriptions={subscriptions} />
            </View>
        </View>
    );
}