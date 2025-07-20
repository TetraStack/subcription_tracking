import React from "react";
import { View, Text, FlatList } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { Subscriptions } from "~/types/subscription";

type Props = {
    subscriptions: Subscriptions[];
};

const defaultColors = [
    "#4f46e5", // Indigo-600
    "#22c55e", // Green-500
    "#facc15", // Yellow-400
    "#f97316", // Orange-500
    "#ec4899", // Pink-500
];

const Pie = ({ subscriptions }: Props) => {
    const categoryMap: Record<string, number> = {};

    subscriptions.forEach((sub) => {
        let multiplier = 1;
        switch (sub.subscription_type) {
            case "Weekly":
                multiplier = 4.33;
                break;
            case "Bi-weekly":
                multiplier = 2.17;
                break;
            case "Monthly":
                multiplier = 1;
                break;
        }

        const amount = Number(sub.subscription_amount) * multiplier;

        if (categoryMap[sub.subscription_category]) {
            categoryMap[sub.subscription_category] += amount;
        } else {
            categoryMap[sub.subscription_category] = amount;
        }
    });

    const pieData = Object.entries(categoryMap).map(([label, value], index) => ({
        value: Number(value.toFixed(2)),
        color: defaultColors[index % defaultColors.length],
        text: label,
    }));

    const total = pieData.reduce((a, b) => a + b.value, 0);

    if (pieData.length === 0) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-base text-gray-600">No data to show</Text>
            </View>
        );
    }

    return (
        <View className="bg-white rounded-xl p-5 mx-4 shadow-md">
            <Text className="text-center text-lg font-semibold text-zinc-800  mb-4">
                Monthly Expenses by Category
            </Text>

            <View className="items-center">
                <PieChart
                    data={pieData}
                    donut
                    radius={120}
                    innerRadius={70}
                />
            </View>

            {/* Legend */}
            <View className="mt-6">
                <Text className="text-center text-base font-medium text-zinc-700 mb-2">
                    Category Breakdown
                </Text>
                <FlatList
                    data={pieData}
                    keyExtractor={(item) => item.text}
                    scrollEnabled={false}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    renderItem={({ item }) => (
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-row items-center">
                                <View
                                    className="h-4 w-4 rounded-full mr-3"
                                    style={{ backgroundColor: item.color }}
                                />
                                <Text className="text-sm text-zinc-800">
                                    {item.text}
                                </Text>
                            </View>
                            <Text className="text-sm font-semibold text-zinc-600">
                                ₹{item.value.toFixed(2)}
                            </Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

export default Pie;
