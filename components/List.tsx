import { Calendar } from 'react-native-calendars';
import { View, Text, ScrollView, FlatList } from 'react-native';
import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { subscriptions } from '~/data/data';
import dayjs from "dayjs";
import { Subscriptions } from "~/types/subscription";
import { getNextDueDate } from "~/utils/helper";

const List = ({ subscriptions }: { subscriptions: Subscriptions[] }) => {
  const [value, setValue] = useState("List");

  // Sort subscriptions by next due date ascending
  const sortedSubscriptions = [...subscriptions].sort((a, b) => {
    const nextDueA = getNextDueDate(a.subscription_date, a.subscription_type);
    const nextDueB = getNextDueDate(b.subscription_date, b.subscription_type);
    return new Date(nextDueA).getTime() - new Date(nextDueB).getTime();
  });

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
            data={sortedSubscriptions}
            renderItem={({ item }) => {
              const nextdueDate = getNextDueDate(
                item.subscription_date,
                item.subscription_type
              );
              const { label, isDue } = getDaysRemaining(nextdueDate);
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
                      className={`text-sm ${isDue ? "text-red-500" : "text-gray-500"
                        }`}
                    >
                      {label}
                    </Text>
                  </View>
                  <Text className="text-base font-semibold text-gray-800">
                    ${Number(item.subscription_amount).toFixed(2)}
                  </Text>
                </View>
              );
            }}
            keyExtractor={(item) => item.subscription_name}
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
