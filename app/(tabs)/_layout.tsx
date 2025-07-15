import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemeToggle } from "~/components/ThemeToggle";

export default function RootLayout() {
    const insets = useSafeAreaInsets();
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "black",
                tabBarStyle: {
                    height: 30 + insets.bottom,
                    paddingBottom: insets.bottom,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    headerRight: () => <ThemeToggle />,
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
                name="setting"
                options={{
                    title: "Setting",
                    headerRight: () => <ThemeToggle />,
                    tabBarIcon: ({ color }) => (
                        <FontAwesome size={28} name="gear" color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}