import { Stack, useRouter } from "expo-router";
import { Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { ArrowLeft } from "lucide-react-native";

import { Platform } from "react-native";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack>
        <Stack.Screen
          name="createSubscription"
          options={{
            title: "Add Subscription",
            headerShown: true,
            headerBackVisible: true,
            headerLeft:
              Platform.OS === "ios"
                ? () => {
                    const router = useRouter();
                    return (
                      <Pressable onPress={() => router.back()}>
                        <ArrowLeft />
                      </Pressable>
                    );
                  }
                : undefined,
          }}
        />
      </Stack>
    </SafeAreaView>
  );
}
