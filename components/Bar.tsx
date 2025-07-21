import React from "react";
import { View, Text, FlatList } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { Subscriptions } from "~/types/subscription";

type Props = {
    subscriptions: Subscriptions[];
};

// Generate a color palette with more options
const colors = [
    "#4f46e5", "#22c55e", "#facc15", "#f97316", "#ec4899", "#10b981", "#3b82f6",
    "#e11d48", "#8b5cf6", "#0ea5e9", "#a855f7", "#14b8a6", "#eab308", "#ef4444",
];

const Bar = ({ subscriptions }: Props) => {
    const categoryMap: Record<string, { name: string; value: number }[]> = {};
    const colorMap: Record<string, string> = {};
    let colorIndex = 0;

    subscriptions.forEach((sub) => {
        let multiplier = 1;
        switch (sub.subscription_type.toLowerCase()) {
            case "weekly":
                multiplier = 4.33;
                break;
            case "bi-weekly":
                multiplier = 2.17;
                break;
            case "monthly":
                multiplier = 1;
                break;
        }

        const amount = Number(sub.subscription_amount) * multiplier;

        if (!categoryMap[sub.subscription_category]) {
            categoryMap[sub.subscription_category] = [];
        }

        // Assign a unique color to each subscription name
        if (!colorMap[sub.subscription_name]) {
            colorMap[sub.subscription_name] = colors[colorIndex % colors.length];
            colorIndex++;
        }

        categoryMap[sub.subscription_category].push({
            name: sub.subscription_name,
            value: Number(amount.toFixed(2)),
        });
    });

    const barData = Object.entries(categoryMap).map(([category, subs]) => ({
        label: category,
        stacks: subs.map((sub) => ({
            value: sub.value,
            color: colorMap[sub.name],
        })),
    }));

    // For Legend
    const legendData = Object.entries(colorMap).map(([name, color]) => ({
        name,
        color,
    }));

    const stackData = Object.entries(categoryMap).map(([category, subs]) => ({
        label: category,
        stacks: subs.map(sub => ({
            value: sub.value,
            color: colorMap[sub.name],
        })),
    }));

    if (barData.length === 0) {
        return (
            <View className="flex-1 items-center justify-center p-4">
                <Text className="text-base text-gray-600">No data to show</Text>
            </View>
        );
    }

    return (
        <View className="bg-white rounded-xl p-5 mx-4 shadow-md mt-4">
            <Text className="text-center text-lg font-semibold text-zinc-800 mb-4">
                Service Costs per Category
            </Text>

            <BarChart
                barWidth={30}
                stackData={stackData}
                spacing={30}
                roundedTop
                hideRules
                yAxisThickness={0}
                xAxisColor="#e5e7eb"
                noOfSections={5}
                isAnimated
                yAxisTextStyle={{ color: "#6b7280" }}
                xAxisLabelTextStyle={{ color: "#374151", fontSize: 12 }}
            />

            {/* Legend */}
            <View className="mt-6">
                <Text className="text-center text-base font-medium text-zinc-700 mb-2">
                    Subscriptions Breakdown
                </Text>
                <FlatList
                    data={legendData}
                    keyExtractor={(item) => item.name}
                    scrollEnabled={false}
                    numColumns={2}
                    columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 10 }}
                    renderItem={({ item }) => (
                        <View className="flex-row items-center mb-3">
                            <View
                                className="h-4 w-4 rounded-full mr-2"
                                style={{ backgroundColor: item.color }}
                            />
                            <Text className="text-sm text-zinc-800">{item.name}</Text>
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

export default Bar;
