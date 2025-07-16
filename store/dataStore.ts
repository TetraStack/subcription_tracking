import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from 'zustand'
import { Subscriptions } from "~/types/subscription";

interface dataStoreType {
    subscription: Subscriptions[],
    getAllsubscription: () => Promise<void>
    addSubscription: (data: Subscriptions) => Promise<void>
}

export const useDataStore = create<dataStoreType>()((set) => ({
    subscription: [],
    getAllsubscription: async () => {
        const jsonValue = await AsyncStorage.getItem('subscription');
        const subscriptions: Subscriptions[] = jsonValue != null ? JSON.parse(jsonValue) : [];
        set({ subscription: subscriptions })

    },
    addSubscription: async (data) => {

        const jsonValue = await AsyncStorage.getItem('subscription');
        const subscriptions: Subscriptions[] = jsonValue != null ? JSON.parse(jsonValue) : [];
        const latestData = [...subscriptions, { ...data }];

        await AsyncStorage.setItem('subscription', JSON.stringify(latestData));
        set({ subscription: latestData })

    },
}))

