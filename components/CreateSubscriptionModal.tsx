import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import clsx from "clsx";
import dayjs from "dayjs";
import { icons } from "@/constants/icons";

interface CreateSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  onAddSubscription: (sub: any) => void;
}

const CATEGORIES = [
  "Entertainment",
  "AI Tools",
  "Developer Tools",
  "Design",
  "Productivity",
  "Cloud",
  "Music",
  "Other",
];

const CATEGORY_COLORS: Record<string, string> = {
  Entertainment: "#ffb6c1",
  "AI Tools": "#b8d4e3",
  "Developer Tools": "#e8def8",
  Design: "#f5c542",
  Productivity: "#b8e8d0",
  Cloud: "#a0c4ff",
  Music: "#cbb2fe",
  Other: "#e5e5e5",
};

export default function CreateSubscriptionModal({
  visible,
  onClose,
  onAddSubscription,
}: CreateSubscriptionModalProps) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [frequency, setFrequency] = useState<"Monthly" | "Yearly">("Monthly");
  const [category, setCategory] = useState<string>("Entertainment");

  const parsedPrice = parseFloat(price);
  const isValid = name.trim().length > 0 && !isNaN(parsedPrice) && parsedPrice > 0;

  const handleSubmit = () => {
    if (!isValid) return;

    const newSubscription = {
      id: Date.now().toString(),
      name: name.trim(),
      price: parsedPrice,
      frequency,
      category,
      status: "active", // per prompt
      startDate: dayjs().toISOString(),
      renewalDate: dayjs()
        .add(1, frequency === "Monthly" ? "month" : "year")
        .toISOString(),
      icon: icons.wallet, // per prompt
      billing: frequency,
      color: CATEGORY_COLORS[category] || "#e5e5e5",
    };

    onAddSubscription(newSubscription);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setFrequency("Monthly");
    setCategory("Entertainment");
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="modal-overlay">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="flex-1"
        >
          <View className="modal-container">
            <View className="modal-header">
              <Text className="modal-title">New Subscription</Text>
              <Pressable
                onPress={() => {
                  resetForm();
                  onClose();
                }}
                className="modal-close"
              >
                <Text className="modal-close-text">X</Text>
              </Pressable>
            </View>

            <ScrollView className="modal-body" contentContainerClassName="pb-10">
              <View className="auth-field mb-4">
                <Text className="auth-label">Name</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  className="auth-input"
                  placeholder="e.g. Spotify"
                />
              </View>

              <View className="auth-field mb-4">
                <Text className="auth-label">Price</Text>
                <TextInput
                  value={price}
                  onChangeText={setPrice}
                  className="auth-input"
                  keyboardType="decimal-pad"
                  placeholder="0.00"
                />
              </View>

              <View className="auth-field mb-4">
                <Text className="auth-label">Frequency</Text>
                <View className="picker-row">
                  <Pressable
                    onPress={() => setFrequency("Monthly")}
                    className={clsx(
                      "picker-option",
                      frequency === "Monthly" && "picker-option-active"
                    )}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "Monthly" && "picker-option-text-active"
                      )}
                    >
                      Monthly
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setFrequency("Yearly")}
                    className={clsx(
                      "picker-option",
                      frequency === "Yearly" && "picker-option-active"
                    )}
                  >
                    <Text
                      className={clsx(
                        "picker-option-text",
                        frequency === "Yearly" && "picker-option-text-active"
                      )}
                    >
                      Yearly
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View className="auth-field mb-8">
                <Text className="auth-label">Category</Text>
                <View className="category-scroll">
                  {CATEGORIES.map((c) => (
                    <Pressable
                      key={c}
                      onPress={() => setCategory(c)}
                      className={clsx(
                        "category-chip",
                        category === c && "category-chip-active"
                      )}
                    >
                      <Text
                        className={clsx(
                          "category-chip-text",
                          category === c && "category-chip-text-active"
                        )}
                      >
                        {c}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              <Pressable
                onPress={handleSubmit}
                disabled={!isValid}
                className={clsx(
                  "auth-button",
                  !isValid && "auth-button-disabled"
                )}
              >
                <Text className="auth-button-text">Create Subscription</Text>
              </Pressable>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}
