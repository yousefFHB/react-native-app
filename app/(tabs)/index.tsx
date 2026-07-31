import "@/global.css";
import { useUser } from "@clerk/expo";
import { Link } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";
import {
  HOME_BALANCE,
  HOME_SUBSCRIPTIONS,
  UPCOMING_SUBSCRIPTIONS,
} from "@/constants/data";
import { icons } from "@/constants/icons";
import { formatCurrency } from "@/lib/utils";
import dayjs from "dayjs";
import ListHeading from "@/components/ListHeading";
import UpComingSeubscriptionsCard from "@/components/UpComingSeubscriptionsCard";
import SubscriptionCard from "@/components/SubscriptionCard";
const SafeAreaView = styled(RNSafeAreaView);
export default function App() {
  const { user } = useUser();
  const displayName =
    user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`
      : user?.firstName || "کاربر";

  const avatarSource = user?.imageUrl ? { uri: user.imageUrl } : images.avatar;

  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  return (
    <SafeAreaView
      style={{ direction: "rtl" }}
      className="flex-1 bg-background p-5"
    >
      <FlatList
        ListHeaderComponent={() => (
          <>
            <View className="home-header">
              <View className="home-user">
                <Image className="home-avatar " source={avatarSource} />
                <Text className="home-user-name">{displayName}</Text>
              </View>
              <Image source={icons.add} className="home-add-icon"></Image>
            </View>
            <View className="home-balance-card ">
              <Text className="home-balance-label">موجودی</Text>
              <View className="home-balance-row">
                <Text className="home-balance-amount">
                  {formatCurrency(HOME_BALANCE.amount)}
                </Text>
                <Text className="home-balance-date">
                  {dayjs(HOME_BALANCE.nextRenewalDate).format("MM/DD")}
                </Text>
              </View>
            </View>
            <View className="mb-5">
              <ListHeading title="پیش رو" />
              <FlatList
                data={UPCOMING_SUBSCRIPTIONS}
                renderItem={({ item }) => (
                  <UpComingSeubscriptionsCard {...item} />
                )}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <Text className="home-empty-state">محصولی یافت نشد</Text>
                }
              ></FlatList>
            </View>
            <ListHeading title="تمامی اشتراک ها" />
          </>
        )}
        showsVerticalScrollIndicator={false}
        data={HOME_SUBSCRIPTIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SubscriptionCard
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
            {...item}
          />
        )}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4"></View>}
        ListEmptyComponent={
          <Text className="home-empty-state"> اشتراک فعالی وجود ندارد</Text>
        }
        contentContainerClassName="pb-30"
      ></FlatList>
    </SafeAreaView>
  );
}
