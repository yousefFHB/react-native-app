import SubscriptionCard from '@/components/SubscriptionCard'
import { useSubscriptionStore } from '@/constants/store'
import { styled } from "nativewind"
import React, { useState } from 'react'
import { FlatList, KeyboardAvoidingView, LayoutAnimation, Platform, Text, TextInput, View } from 'react-native'
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { subscriptions } = useSubscriptionStore();

  const filteredSubscriptions = subscriptions.filter(sub => {
    const query = searchQuery.toLowerCase();
    return sub.name.toLowerCase().includes(query) ||
      sub.category?.toLowerCase().includes(query) ||
      sub.plan?.toLowerCase().includes(query);
  });

  return (
    <SafeAreaView style={{ direction: "rtl" }} className="flex-1  bg-background">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 p-5">
          <Text className="text-3xl font-rezvan  text-foreground mb-6 ">اشتراک‌های من</Text>

          <View className="mb-6">
            <TextInput
              className="bg-cream rounded-full px-5 py-3 font-vazir text-right text-foreground"
              placeholder="جستجوی اشتراک (نام، دسته‌بندی و...)"
              placeholderTextColor="#888"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FlatList className='mb-15'
            data={filteredSubscriptions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="mb-6">
                <SubscriptionCard
                  {...item}
                  expanded={expandedId === item.id}
                  onPress={() => {
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setExpandedId(expandedId === item.id ? null : item.id);
                  }}
                />
              </View>
            )}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <View className="flex-1 items-center justify-center pt-10">
                <Text className="font-vazir text-gray-500">هیچ اشتراکی یافت نشد.</Text>
              </View>
            )}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default Subscriptions