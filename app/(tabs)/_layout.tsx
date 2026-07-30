import { tabs } from "@/constants/data";
import { Tabs } from "expo-router";
import { Image, View } from "react-native";
import { colors, components } from "@/constants/theme";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// eslint-disable-next-line import/no-named-as-default
import clsx from "clsx";

const tabBar = components.tabBar;
const TabLayout = () => {
  const insets = useSafeAreaInsets();
  const TabIcon = ({ focused, icon }: TabIconProps) => {
    return (
      <View className="tabs-icon">
        <View className={clsx("tabs-pill", focused && "tabs-active")}>
          <Image source={icon} className="tabs-glyph" resizeMode="contain" />
        </View>
      </View>
    );
  };
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: Math.max(insets.bottom, tabBar.horizontalInset),
          height: tabBar.height,
          marginHorizontal: tabBar.horizontalInset,
          borderRadius: tabBar.radius,
          backgroundColor: colors.card,
          borderTopWidth: 0,
          
          
          shadowColor: colors.border,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 1,
          shadowRadius: tabBar.radius,
          elevation: 0,
        },
        tabBarItemStyle: {
            paddingVertical:tabBar.height / 2 - tabBar.iconFrame / 1.6,

          },
          tabBarIconStyle: {
            width: tabBar.iconFrame,
            height: tabBar.iconFrame,alignItems:'center',
          }
      }}
    >
      {tabs.map((tab) => {
        return (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ focused }) => (
                <TabIcon focused={focused} icon={tab.icon} />
              ),
            }}
          />
        );
      })}
    </Tabs>
  );
};

export default TabLayout;
