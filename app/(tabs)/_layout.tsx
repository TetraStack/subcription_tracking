import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs, useNavigation } from "expo-router";
import { PlusCircle, PlusIcon } from "lucide-react-native";
import { Pressable, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { ThemeToggle } from "~/components/ThemeToggle";

export default function RootLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerRight: () => (
            <Link href="/createSubscription" asChild>
              <Pressable className="mr-5">
                <PlusIcon />
              </Pressable>
            </Link>
          ),
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chart"
        options={{
          title: "Chart",
          headerRight: () => <ThemeToggle />,
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="line-chart" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="subscription"
        options={{
          title: "Subscription",
          headerRight: () => {
            return (
              <Link href={"/createSubscription"} asChild>
                <Pressable className="mr-5">
                  <PlusIcon />
                </Pressable>
              </Link>
            );
          },
          tabBarIcon: ({ color }) => (
            <FontAwesome size={28} name="money" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
