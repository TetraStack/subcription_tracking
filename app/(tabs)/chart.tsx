import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Pie from "~/components/Pie";

import { useDataStore } from "~/store/dataStore";

const chart = () => {
    const { subscription, getAllsubscription } = useDataStore();

    useEffect(() => {
        getAllsubscription();
    }, []);
    return (
        <View>
            <Pie subscriptions={subscription} />
        </View>
    );
};

export default chart;