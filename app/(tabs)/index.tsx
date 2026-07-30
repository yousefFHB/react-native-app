import '@/global.css'
import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'
import {styled} from "nativewind"
import { SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context'
const SafeAreaView = styled(RNSafeAreaView);
export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className='text-2xl font-bold text-primary mb-4'>welcome</Text>
      <Link href='/onboarding' className='mt-10 flex justify-between items-center max-w-60 mx-auto active:scale-[1.1] transition-all  text-center  rounded bg-primary text-white p-4'>
        <Text className='text-lg text-background'>Go to Onboarding</Text>
      </Link>
      <Link href='/(auth)/sign-in' className='mt-10 flex justify-between items-center max-w-60 mx-auto active:scale-[1.1] transition-all  text-center  rounded bg-primary text-white p-4'>
        <Text className='text-lg text-background'>sign in</Text>
      </Link>
      <Link href='/(auth)/sign-up' className='mt-10 flex justify-between items-center max-w-60 mx-auto active:scale-[1.1] transition-all  text-center  rounded bg-primary text-white p-4'>
        <Text className='text-lg text-background'>sign up</Text>
      </Link>
      <Link href={{ pathname: '/subscriptions/[id]', params: { id: 'claude' } }}>
        claude max subs</Link>
    </SafeAreaView >
  )
}
