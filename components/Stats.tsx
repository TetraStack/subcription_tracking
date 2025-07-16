import { View, Text } from "react-native";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useDataStore } from "~/store/dataStore";
import { calculateMonthlyExpense } from "~/utils/helper";
import { Subscriptions } from "~/types/subscription";

const Stats = ({ subscriptions }: { subscriptions: Subscriptions[] }) => {
  const monthlyExpense = calculateMonthlyExpense(subscriptions);

  return (
    <View className="mt-10 ">
      <Card className="w-[350px] h-[120px] border-none ">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Monthly Spend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="text-5xl font-bold">${monthlyExpense}</Text>
        </CardContent>
      </Card>
    </View>
  );
};

export default Stats;
