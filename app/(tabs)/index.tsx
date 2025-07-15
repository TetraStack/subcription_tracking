import { Text, View } from "react-native";
import List from "~/components/List";
import Stats from "~/components/Stats";


export default function Index() {
    return (
        <View
            className="flex justify-center bg-white items-end"
        >
            <View className="m-4">
                <Stats />
            </View>
            <View>
                <List />
            </View>
        </View>
    );
}