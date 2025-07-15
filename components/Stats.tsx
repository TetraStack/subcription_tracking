import { View, Text } from "react-native";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const Stats = () => {
  return (
    <View className="mt-10">
      <Card className="w-[350px] h-[120px] border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            Monthly Spend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Text className="text-5xl font-bold">$122.50</Text>
        </CardContent>
      </Card>
    </View>
  );
};

export default Stats;
