import React, { useState } from "react";
import { Text, TextInput, View } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DatePicker, {
  RangeOutput,
  SingleOutput,
} from "react-native-neat-date-picker";
import { Switch } from "react-native";

import ModalSelector from "react-native-modal-selector";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button as NativeButton } from "~/components/nativewindui/Button";
import { useDataStore } from "~/store/dataStore";
import { useNavigation } from "expo-router";
import * as Crypto from "expo-crypto";

type FormData = {
  serviceName: string;
  category: string;
  startDate: string;
  cost: number;
  billing_frequency: "monthly" | "bi-weekly" | "yearly";
  notification: boolean;
};

const createSubscription = () => {
  const addSubscription = useDataStore((state) => state.addSubscription);
  const { getAllsubscription, subscription } = useDataStore();

  const navigation = useNavigation();

  const [showDatePickerSingle, setShowDatePickerSingle] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({});

  // Update onSubmit to show correct value
  const onSubmit = async (data: FormData) => {
    const id = Crypto.randomUUID();

    try {
      await addSubscription({
        subscription_id: id,
        subscription_name: data.serviceName,
        subscription_date: data.startDate,
        subscription_category: data.category,
        subscription_amount: data.cost,
        subscription_type: data.billing_frequency,
        subscription_notification: data.notification,
      });
    } catch (error) {
      console.log(error);
    }

    await getAllsubscription();
    console.log("latest ", subscription);

    navigation.goBack();
  };

  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1"
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
    >
      <View className="flex-1 pb-10 ">
        <View className="flex p-4 gap-4">
          {/* service name */}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className="bg-zinc-100 rounded-xl px-4 py-6 "
                placeholder="Service Name"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="serviceName"
          />
          {errors.serviceName && <Text>This is required.</Text>}

          {/* Category */}

          <Controller
            control={control}
            name="category"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <ModalSelector
                data={[
                  { key: 1, label: "Entertainment", value: "Entertainment" },
                  { key: 2, label: "Productivity", value: "Productivity" },
                  { key: 3, label: "Cloud Storage", value: "Cloud-Storage" },
                  { key: 4, label: "Music & Audio", value: "Music & Audio" },
                  { key: 5, label: "News & Publications", value: "News" },
                ]}
                initValue="Select category..."
                onChange={(option) => onChange(option.value)}
                selectedKey={value}
              >
                <TextInput
                  className="bg-zinc-100 rounded-xl px-4 py-6"
                  editable={false}
                  placeholder="Select category"
                  value={value}
                />
              </ModalSelector>
            )}
          />

          {/* cost and frequency */}
          <View className="flex flex-row w-full items-center gap-5">
            {/* cost */}
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  className="bg-zinc-100 rounded-xl px-4 py-6 flex-1 "
                  placeholder="Cost"
                  onBlur={onBlur}
                  keyboardType="numeric"
                  onChangeText={onChange}
                />
              )}
              name="cost"
            />
            {errors.cost && <Text>This is required.</Text>}

            {/* billing_frequency */}
            <Controller
              control={control}
              name="billing_frequency"
              rules={{ required: true }}
              render={({ field: { onChange, value } }) => (
                <ModalSelector
                  data={[
                    { key: 1, label: "Weekly", value: "Weekly" },
                    { key: 2, label: "Bi-weekly", value: "Bi-weekly" },
                    { key: 3, label: "Monthly", value: "Monthly" },
                    { key: 4, label: "Yearly", value: "Yearly" },
                  ]}
                  initValue="Select Frequency..."
                  onChange={(option) => onChange(option.value)}
                  selectedKey={value}
                >
                  <TextInput
                    className="bg-zinc-100 rounded-xl px-4 py-6"
                    editable={false}
                    placeholder="Select Frequency"
                    value={value}
                  />
                </ModalSelector>
              )}
            />
          </View>

          {/* startDate */}
          <Controller
            control={control}
            name="startDate"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => (
              <>
                <TextInput
                  onPress={() => setShowDatePickerSingle(true)}
                  className="bg-zinc-100 rounded-xl px-4 py-6"
                  editable={false}
                  placeholder="Start Date"
                  value={value}
                />

                <DatePicker
                  isVisible={showDatePickerSingle}
                  mode={"single"}
                  onCancel={() => setShowDatePickerSingle(false)}
                  onConfirm={(output: SingleOutput) => {
                    onChange(output.dateString ?? "");
                    setShowDatePickerSingle(false);
                  }}
                />
              </>
            )}
          />

          {/* Notification */}

          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View className="flex flex-row items-center justify-between">
                <Text>Notification</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={onChange}
                  value={value}
                />
              </View>
            )}
            name="notification"
          />
          {errors.notification && <Text>This is required.</Text>}
        </View>

        <View className="flex flex-row px-4 ">
          <NativeButton
            className="bg-blue-500 w-full"
            style={{ height: 55 }}
            onPress={handleSubmit(onSubmit)}
          >
            <Text className="text-white font-semibold">Save</Text>
          </NativeButton>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default createSubscription;
