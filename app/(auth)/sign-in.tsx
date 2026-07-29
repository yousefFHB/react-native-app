import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const SignIn = () => {
  return (
    <View>
      <Text>SignIn</Text>
      <Link href="/(auth)/sign-in" className="mt-4 rounded bg-primary text-white p-4">
        <Text className="text-lg text-accent">Dont have an account? Sign Up</Text>
      </Link>
    </View>
  )
}

export default SignIn