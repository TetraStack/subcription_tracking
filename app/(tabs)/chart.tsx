import React, { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import Bar from "~/components/Bar";
import Pie from "~/components/Pie";

import { useDataStore } from "~/store/dataStore";

const chart = () => {
    const { subscription, getAllsubscription } = useDataStore();

    useEffect(() => {
        getAllsubscription();
    }, []);
    return (
        <ScrollView>
            <Pie subscriptions={subscription} />
            <Bar subscriptions={subscription} />
        </ScrollView>
    );
};

export default chart;