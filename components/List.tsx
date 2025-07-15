import { View, Text, ScrollView, FlatList } from "react-native";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { subscriptions } from "~/data/data";
import dayjs from "dayjs";

const List = () => {
  const [value, setValue] = useState("List");

  const getDaysRemaining = (date: string) => {
    const now = dayjs();
    const target = dayjs(date);
    const diff = target.diff(now, "day");

    if (diff < 0) return { label: "Overdue", isDue: true };
    if (diff === 0) return { label: "Due today", isDue: true };
    return { label: `Due in ${diff} day${diff > 1 ? "s" : ""}`, isDue: false };
  };
  return (
    <View className="flex justify-center p-6">
      <Text className="text-2xl font-semibold pb-3">Upcoming</Text>
      <Tabs value={value} onValueChange={setValue} className="w-[350px]">
        <TabsList className="flex-row w-full">
          <TabsTrigger value="List" className="flex-1">
            <Text>List</Text>
          </TabsTrigger>
          <TabsTrigger value="Calendar" className="flex-1">
            <Text>Calendar</Text>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="List">
          <FlatList
            className="max-h-[400]"
            showsVerticalScrollIndicator={false}
            data={subscriptions}
            renderItem={({ item }) => {
              const { label, isDue } = getDaysRemaining(item.subscription_date);
              return (
                <View
                  key={item.subscription_id}
                  className="flex-row justify-between items-center border-b border-gray-300 py-3 mt-1"
                >
                  <View>
                    <Text className="text-base font-medium">
                      {item.subscription_name}
                    </Text>
                    <Text
                      className={`text-sm ${
                        isDue ? "text-red-500" : "text-gray-500"
                      }`}
                    >
                      {label}
                    </Text>
                  </View>
                  <Text className="text-base font-semibold text-gray-800">
                    ${item.subscription_amount.toFixed(2)}
                  </Text>
                </View>
              );
            }}
            keyExtractor={(item) => item.subscription_id}
          />
        </TabsContent>
        <TabsContent value="Calendar">
          <Text>Calendar</Text>
        </TabsContent>
      </Tabs>
    </View>
  );
};

export default List;
