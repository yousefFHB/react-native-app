import React, { useMemo } from 'react';
import { View, Text, Dimensions, ScrollView } from 'react-native';
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { useSubscriptionStore } from '@/constants/store';
import { formatCurrency } from '@/lib/utils';
import { PieChart, BarChart } from 'react-native-chart-kit';

const SafeAreaView = styled(RNSafeAreaView);
const screenWidth = Dimensions.get("window").width;

const Insights = () => {
  const { subscriptions } = useSubscriptionStore();

  const { pieData, totalMonthly, barData } = useMemo(() => {
    const categoryTotals: Record<string, { total: number; color: string }> = {};
    let total = 0;

    subscriptions.forEach((sub) => {
      let monthlyCost = sub.price;
      if (sub.billing === "سالانه" || sub.billing === "Yearly") {
        monthlyCost = sub.price / 12;
      }
      
      total += monthlyCost;

      const cat = sub.category || "سایر";
      if (!categoryTotals[cat]) {
        categoryTotals[cat] = { total: 0, color: sub.color || "#8fd1bd" };
      }
      categoryTotals[cat].total += monthlyCost;
    });

    const pie = Object.keys(categoryTotals).map((cat) => ({
      name: cat,
      population: Math.round(categoryTotals[cat].total),
      color: categoryTotals[cat].color,
      legendFontColor: "#081126",
      legendFontSize: 13,
    })).sort((a, b) => b.population - a.population);

    const labels = pie.slice(0, 4).map(p => p.name);
    const data = pie.slice(0, 4).map(p => p.population);

    const bar = {
      labels: labels.length > 0 ? labels : ["Empty"],
      datasets: [
        {
          data: data.length > 0 ? data : [0]
        }
      ]
    };

    return { pieData: pie, totalMonthly: total, barData: bar };
  }, [subscriptions]);

  const chartConfig = {
    backgroundGradientFrom: "#002f49",
    backgroundGradientTo: "#002f49",
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false 
  };

  return (
    <SafeAreaView style={{ direction: "rtl" }} className="flex-1 bg-background p-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerClassName="pb-30">
        <Text className="text-3xl font-rezvan text-foreground mb-6">تحلیل‌ها</Text>
        
        <View className="mb-6 rounded-2xl bg-primary p-6">
          <Text className="text-lg font-vazir text-white/80 mb-2">مجموع هزینه ماهانه</Text>
          <Text className="text-3xl font-sans-extrabold text-white">
            {formatCurrency(totalMonthly)}
          </Text>
        </View>

        {pieData.length > 0 ? (
          <>
            <View className="mb-6 bg-cream rounded-2xl p-4 overflow-hidden">
              <Text className="text-xl font-vazir text-primary mb-4 text-center">هزینه به تفکیک دسته‌بندی</Text>
              <View style={{ direction: 'ltr', alignItems: 'center' }}>
                <PieChart
                  data={pieData}
                  width={screenWidth - 70}
                  height={220}
                  chartConfig={chartConfig}
                  accessor={"population"}
                  backgroundColor={"transparent"}
                  paddingLeft={"0"}
                  center={[0, 0]}
                  absolute
                />
              </View>
            </View>

            <View className="mb-6 bg-cream rounded-2xl p-4 overflow-hidden">
              <Text className="text-xl font-vazir text-primary mb-4 text-center">بیشترین هزینه‌ها</Text>
              <View style={{ direction: 'ltr', alignItems: 'center' }}>
                <BarChart
                  data={barData}
                  width={screenWidth - 70}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix=""
                  chartConfig={chartConfig}
                  verticalLabelRotation={30}
                  style={{
                    borderRadius: 16
                  }}
                />
              </View>
            </View>
          </>
        ) : (
          <View className="flex-1 items-center justify-center pt-10">
            <Text className="font-vazir text-gray-500">داده‌ای برای تحلیل وجود ندارد.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Insights;