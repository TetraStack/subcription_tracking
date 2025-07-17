import { View, Text, ScrollView, FlatList, Modal, Pressable } from "react-native";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Calendar } from "react-native-calendars";
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

  const [selectedDate, setSelectedDate] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState<Subscriptions[]>([]);

  const markedDates = subscriptions.reduce((acc, sub) => {
    const date = dayjs(sub.subscription_date).format("YYYY-MM-DD");
    acc[date] = {
      customStyles: {
        container: {
          backgroundColor: "#007AFF",
          borderRadius: 6,
        },
        text: {
          color: "white",
          fontWeight: "bold",
        },
      },
    };
    return acc;
  }, {} as any);
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
          <Calendar
            markingType={"custom"}
            markedDates={markedDates}
            onDayPress={(day) => {
              const selected = day.dateString;

              const matchedSubs = subscriptions.filter(
                (sub) =>
                  dayjs(sub.subscription_date).format("YYYY-MM-DD") === selected
              );

              if (matchedSubs.length > 0) {
                setSelectedDate(selected);
                setSelectedSubscriptions(matchedSubs);
                setModalVisible(true);
              }
            }}
            theme={{
              backgroundColor: "#fff",
              calendarBackground: "#fff",
              textSectionTitleColor: "#888",
              dayTextColor: "#000",
              monthTextColor: "#000",
              selectedDayBackgroundColor: "#007AFF",
              todayTextColor: "#007AFF",
              arrowColor: "#007AFF",
              textDisabledColor: "#ccc",
              dotColor: "#007AFF",
              selectedDotColor: "#ffffff",
              textDayFontWeight: "400",
              textMonthFontWeight: "bold",
              textDayHeaderFontWeight: "500",
              textDayFontSize: 14,
              textMonthFontSize: 16,
              textDayHeaderFontSize: 12,
            }}
          />

          {/* Modal */}
          <Modal
            transparent={true}
            animationType="fade"
            visible={modalVisible}
            onRequestClose={() => setModalVisible(false)}
          >
            <View className="flex-1 justify-center items-center bg-black/40">
              <View className="bg-white rounded-xl p-6 w-[80%] shadow-lg">
                <Text className="text-lg font-bold mb-3">
                  Subscriptions on {selectedDate}
                </Text>
                {selectedSubscriptions.map((sub) => (
                  <View key={sub.subscription_id} className="mb-2">
                    <Text className="text-base font-semibold">{sub.subscription_name}</Text>
                    <Text className="text-sm text-gray-600">
                      Amount: ${sub.subscription_amount.toFixed(2)}
                    </Text>
                  </View>
                ))}
                <Pressable
                  onPress={() => setModalVisible(false)}
                  className="mt-4 p-2 bg-blue-600 rounded-lg"
                >
                  <Text className="text-white text-center">Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </TabsContent>

      </Tabs>
    </View>
  );
};

export default List;