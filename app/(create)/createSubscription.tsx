import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  View,
  Modal,
  Platform,
} from "react-native";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { Switch } from "react-native";

import ModalSelector from "react-native-modal-selector";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Button as NativeButton } from "~/components/nativewindui/Button";
import { useDataStore } from "~/store/dataStore";
import { useNavigation } from "expo-router";
import * as Crypto from "expo-crypto";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker, PickerItem } from "~/components/nativewindui/Picker";

type FormData = {
  serviceName: string;
  category: string;
  startDate: string;
  cost: number;
  billing_frequency: "monthly" | "bi-weekly" | "yearly";
  notification: boolean;
};

const createSubscription = () => {
  const insets = useSafeAreaInsets();
  const addSubscription = useDataStore((state) => state.addSubscription);
  const { getAllsubscription, subscription } = useDataStore();
  const [tempDate, setTempDate] = useState(new Date());

  const [pickerDate, setPickerDate] = useState<Date>(new Date());
  const navigation = useNavigation();

  const [showDatePickerSingle, setShowDatePickerSingle] = useState(false);
  const [showFrequencyPicker, setShowFrequencyPicker] = useState(false);
  const [tempFrequency, setTempFrequency] = useState("");
  const [tempCategory, setTempCategory] = useState("");
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
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

  return (
    <KeyboardAwareScrollView>
      <View className="flex-1 pb-10 ">
        <View className="flex-1 p-4 gap-4">
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
              <>
                <Pressable
                  onPress={() => {
                    setTempCategory(value || "");
                    setShowCategoryPicker(true);
                  }}
                >
                  <TextInput
                    className="bg-zinc-100 rounded-xl px-4 py-6"
                    editable={false}
                    placeholder="Select category"
                    value={value}
                    pointerEvents="none"
                  />
                </Pressable>
                <Modal
                  visible={showCategoryPicker}
                  animationType="slide"
                  transparent
                  onRequestClose={() => setShowCategoryPicker(false)}
                >
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "flex-end",
                      backgroundColor: "rgba(0,0,0,0.3)",
                    }}
                  >
                    <View
                      style={{
                        backgroundColor: "white",
                        padding: 16,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                      }}
                    >
                      <Picker
                        selectedValue={tempCategory}
                        onValueChange={setTempCategory}
                        mode="dropdown"
                      >
                        <PickerItem label="Select category..." value="" />
                        <PickerItem
                          label="Entertainment"
                          value="Entertainment"
                        />
                        <PickerItem label="Productivity" value="Productivity" />
                        <PickerItem
                          label="Cloud Storage"
                          value="Cloud-Storage"
                        />
                        <PickerItem
                          label="Music & Audio"
                          value="Music & Audio"
                        />
                        <PickerItem label="News & Publications" value="News" />
                      </Picker>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          marginTop: 16,
                        }}
                      >
                        <Pressable
                          style={{
                            padding: 12,
                            flex: 1,
                            alignItems: "center",
                          }}
                          onPress={() => setShowCategoryPicker(false)}
                        >
                          <Text style={{ color: "red" }}>Cancel</Text>
                        </Pressable>
                        <Pressable
                          style={{
                            padding: 12,
                            flex: 1,
                            alignItems: "center",
                          }}
                          onPress={() => {
                            setShowCategoryPicker(false);
                            onChange(tempCategory);
                          }}
                        >
                          <Text style={{ color: "blue" }}>Confirm</Text>
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </Modal>
              </>
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
                <>
                  <Pressable
                    onPress={() => {
                      setTempFrequency(value || "");
                      setShowFrequencyPicker(true);
                    }}
                  >
                    <TextInput
                      className="bg-zinc-100 rounded-xl px-4 py-6"
                      editable={false}
                      placeholder="Select Frequency"
                      value={value}
                      pointerEvents="none"
                    />
                  </Pressable>
                  <Modal
                    visible={showFrequencyPicker}
                    animationType="slide"
                    transparent
                    onRequestClose={() => setShowFrequencyPicker(false)}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        backgroundColor: "rgba(0,0,0,0.3)",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "white",
                          padding: 16,
                          borderTopLeftRadius: 16,
                          borderTopRightRadius: 16,
                        }}
                      >
                        <Picker
                          selectedValue={tempFrequency}
                          onValueChange={setTempFrequency}
                          mode="dropdown"
                        >
                          <PickerItem label="Select Frequency..." value="" />
                          <PickerItem label="Weekly" value="Weekly" />
                          <PickerItem label="Bi-weekly" value="Bi-weekly" />
                          <PickerItem label="Monthly" value="Monthly" />
                          <PickerItem label="Yearly" value="Yearly" />
                        </Picker>
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 16,
                          }}
                        >
                          <Pressable
                            style={{
                              padding: 12,
                              flex: 1,
                              alignItems: "center",
                            }}
                            onPress={() => setShowFrequencyPicker(false)}
                          >
                            <Text style={{ color: "red" }}>Cancel</Text>
                          </Pressable>
                          <Pressable
                            style={{
                              padding: 12,
                              flex: 1,
                              alignItems: "center",
                            }}
                            onPress={() => {
                              setShowFrequencyPicker(false);
                              onChange(tempFrequency);
                            }}
                          >
                            <Text style={{ color: "blue" }}>Confirm</Text>
                          </Pressable>
                        </View>
                      </View>
                    </View>
                  </Modal>
                </>
              )}
            />
          </View>

          {/* startDate */}
          <Controller
            control={control}
            name="startDate"
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => {
              return (
                <>
                  {!showDatePickerSingle && (
                    <Pressable
                      onPress={() => {
                        setShowDatePickerSingle(true);
                      }}
                    >
                      <TextInput
                        className="bg-zinc-100 rounded-xl px-4 py-6"
                        editable={false}
                        placeholder="Start Date"
                        value={value}
                        pointerEvents="none"
                        onPressIn={() => setShowDatePickerSingle(true)}
                      />
                    </Pressable>
                  )}

                  {showDatePickerSingle && (
                    <View
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: "white",
                        padding: 16,
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                      }}
                    >
                      <DateTimePicker
                        mode="date"
                        display={Platform.OS === "ios" ? "spinner" : "calendar"}
                        value={tempDate}
                        onChange={(_, selectedDate) => {
                          if (Platform.OS === "android") {
                            setShowDatePickerSingle(false);
                            if (selectedDate) {
                              const formatted = selectedDate
                                .toISOString()
                                .split("T")[0];
                              onChange(formatted);
                            }
                          } else {
                            if (selectedDate) setTempDate(selectedDate);
                          }
                        }}
                        style={{ width: "100%" }}
                      />
                      {Platform.OS === "ios" && (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 16,
                          }}
                        >
                          <Pressable
                            style={{
                              padding: 12,
                              flex: 1,
                              alignItems: "center",
                            }}
                            onPress={() => setShowDatePickerSingle(false)}
                          >
                            <Text style={{ color: "red" }}>Cancel</Text>
                          </Pressable>
                          <Pressable
                            style={{
                              padding: 12,
                              flex: 1,
                              alignItems: "center",
                            }}
                            onPress={() => {
                              setShowDatePickerSingle(false);
                              const formatted = tempDate
                                .toISOString()
                                .split("T")[0];
                              onChange(formatted);
                            }}
                          >
                            <Text style={{ color: "blue" }}>Confirm</Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  )}
                </>
              );
            }}
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

export const options = {
  headerShown: false,
};

export default createSubscription;
