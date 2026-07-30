import { Link } from 'expo-router'
import React from 'react'
import { Text, View } from 'react-native'

const SignUp = () => {
  return (
    <View>
      <Text>SignUp</Text>
      <Link href="/(auth)/sign-in" className="mt-10 flex justify-between items-center  text-center  rounded bg-primary text-white p-4">
        sign in
      </Link>
      <Link href="/" className="mt-10 flex justify-between items-center  text-center  rounded bg-primary text-white p-4">
        <Text>Go back to Home (Tabs)</Text>
      </Link>
    </View>
  )
}

export default SignUp