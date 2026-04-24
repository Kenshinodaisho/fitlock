// ============================================================================
// FITLOCK - EXPO + REACT NATIVE
// ============================================================================
// Setup:
// 1. Install Node.js from nodejs.org
// 2. Run: npx create-expo-app fitlock --template blank
// 3. Install dependencies:
//    npx expo install expo-camera expo-haptics expo-image-picker 
//    expo-linear-gradient @expo/vector-icons @react-navigation/native 
//    @react-navigation/bottom-tabs @react-navigation/native-stack 
//    @react-native-async-storage/async-storage react-native-screens 
//    react-native-safe-area-context
// 4. Split this file by "// FILE:" comments into separate files
// 5. Run: npx expo start
// 6. Scan QR code with Expo Go app on your phone
// ============================================================================


// FILE: App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { UserProvider } from './context/UserContext';

import SplashScreen from './screens/SplashScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import MainTabs from './navigation/MainTabs';
import ExerciseScreen from './screens/ExerciseScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <NavigationContainer>
          <StatusBar style="auto" />
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Exercise" component={ExerciseScreen}
              options={{ presentation: 'fullScreenModal' }} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    </SafeAreaProvider>
  );
}


// FILE: context/UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [totalPushups, setTotalPushups] = useState(147);
  const [earnedMinutes, setEarnedMinutes] = useState(23);
  const [streak, setStreak] = useState(7);
  const [profileName, setProfileName] = useState('Champion');
  const [profileAvatar, setProfileAvatar] = useState('💪');
  const [profileLevel, setProfileLevel] = useState(7);
  const [profileXP, setProfileXP] = useState(2340);

  const calculatedCalories = Math.round(totalPushups * 0.32);

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem('@fitlock');
      if (data) {
        const d = JSON.parse(data);
        setTotalPushups(d.totalPushups ?? 147);
        setEarnedMinutes(d.earnedMinutes ?? 23);
        setStreak(d.streak ?? 7);
        setProfileName(d.profileName ?? 'Champion');
        setProfileAvatar(d.profileAvatar ?? '💪');
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@fitlock', JSON.stringify({
      totalPushups, earnedMinutes, streak, profileName, profileAvatar
    }));
  }, [totalPushups, earnedMinutes, streak, profileName, profileAvatar]);

  return (
    <UserContext.Provider value={{
      totalPushups, setTotalPushups,
      earnedMinutes, setEarnedMinutes,
      streak, setStreak,
      profileName, setProfileName,
      profileAvatar, setProfileAvatar,
      profileLevel, profileXP,
      calculatedCalories,
    }}>
      {children}
    </UserContext.Provider>
  );
};


// FILE: screens/SplashScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';

export default function SplashScreen({ navigation }) {
  useEffect(() => {
    const timer = setTimeout(() => navigation.replace('Onboarding'), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient colors={['#f97316', '#ef4444', '#ec4899']} style={styles.container}>
      <FontAwesome5 name="dumbbell" size={56} color="#fff" />
      <Text style={styles.title}>FitLock</Text>
      <Text style={styles.tagline}>SWEAT TO SCROLL</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 48, fontWeight: '900', color: '#fff', marginTop: 20 },
  tagline: { fontSize: 14, color: 'rgba(255,255,255,0.9)', letterSpacing: 3, marginTop: 8 },
});


// FILE: screens/OnboardingScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function OnboardingScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Trade pushups for scrolls</Text>
      <Text style={styles.subtitle}>
        Want to open TikTok? Earn it. Every rep unlocks a minute.
      </Text>
      <TouchableOpacity style={styles.btn} onPress={() => navigation.replace('Main')}>
        <Text style={styles.btnText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, fontWeight: '900', textAlign: 'center', marginBottom: 16 },
  subtitle: { fontSize: 16, color: '#64748b', textAlign: 'center', marginBottom: 40 },
  btn: { backgroundColor: '#0f172a', padding: 18, borderRadius: 20 },
  btnText: { color: '#fff', fontSize: 17, fontWeight: 'bold', textAlign: 'center' },
});


// FILE: navigation/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import StatsScreen from '../screens/StatsScreen';
import SquadScreen from '../screens/SquadScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: '#f97316',
      tabBarIcon: ({ color }) => {
        const icons = { Home: 'home', Stats: 'bar-chart', Squad: 'people', Profile: 'person' };
        return <Ionicons name={icons[route.name]} size={24} color={color} />;
      },
    })}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Squad" component={SquadScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}


// FILE: screens/HomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../context/UserContext';

export default function HomeScreen({ navigation }) {
  const { streak, totalPushups, earnedMinutes } = useUser();

  return (
    <ScrollView style={styles.container}>
      <LinearGradient colors={['#f97316', '#ef4444']} style={styles.header}>
        <Text style={styles.greeting}>Morning, Champion 🔥</Text>
        <Text style={styles.streakText}>🔥 {streak} day streak</Text>
      </LinearGradient>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>PUSHUPS</Text>
          <Text style={styles.statValue}>{totalPushups}</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>EARNED</Text>
          <Text style={styles.statValue}>{earnedMinutes} min</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.startBtn}
        onPress={() => navigation.navigate('Exercise')}>
        <LinearGradient colors={['#f97316', '#ef4444']} style={styles.startGradient}>
          <Ionicons name="flash" size={20} color="#fff" />
          <Text style={styles.startText}>START WORKOUT</Text>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 24, paddingTop: 60 },
  greeting: { fontSize: 24, fontWeight: '900', color: '#fff' },
  streakText: { fontSize: 16, color: '#fff', marginTop: 8 },
  statsRow: { flexDirection: 'row', padding: 16, gap: 12 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 16, borderRadius: 16 },
  statLabel: { fontSize: 11, fontWeight: 'bold', color: '#64748b' },
  statValue: { fontSize: 24, fontWeight: '900', marginTop: 4 },
  startBtn: { margin: 16 },
  startGradient: { flexDirection: 'row', justifyContent: 'center', padding: 18, borderRadius: 20, gap: 8 },
  startText: { color: '#fff', fontWeight: '900', fontSize: 16 },
});


// FILE: screens/ExerciseScreen.js
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useUser } from '../context/UserContext';

export default function ExerciseScreen({ navigation }) {
  const { earnedMinutes, setEarnedMinutes, totalPushups, setTotalPushups } = useUser();
  const [permission, requestPermission] = useCameraPermissions();
  const [isCounting, setIsCounting] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const intervalRef = useRef(null);

  const start = async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) return;
    }
    setIsCounting(true);
    intervalRef.current = setInterval(() => {
      setRepCount(r => r + 1);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, 2500);
  };

  const claim = () => {
    setEarnedMinutes(earnedMinutes + repCount);
    setTotalPushups(totalPushups + repCount);
    navigation.goBack();
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  return (
    <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.container}>
      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={20} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Pushups</Text>
      <Text style={styles.reps}>{repCount}</Text>

      {!isCounting && repCount === 0 && (
        <TouchableOpacity onPress={start}>
          <LinearGradient colors={['#f97316', '#ef4444']} style={styles.btn}>
            <Text style={styles.btnText}>START</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}

      {repCount > 0 && !isCounting && (
        <TouchableOpacity onPress={claim}>
          <LinearGradient colors={['#10b981', '#059669']} style={styles.btn}>
            <Text style={styles.btnText}>CLAIM {repCount} MIN</Text>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, paddingTop: 60 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '900', color: '#fff', textAlign: 'center', marginTop: 40 },
  reps: { fontSize: 80, fontWeight: '900', color: '#fff', textAlign: 'center', marginVertical: 40 },
  btn: { padding: 18, borderRadius: 20, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 16 },
});


// FILE: screens/StatsScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useUser } from '../context/UserContext';

export default function StatsScreen() {
  const { totalPushups, calculatedCalories, streak } = useUser();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>
      <View style={styles.card}>
        <Text>Total Reps: {totalPushups}</Text>
        <Text>Calories: {calculatedCalories} 🔥</Text>
        <Text>Streak: {streak} days</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '900' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginTop: 16 },
});


// FILE: screens/SquadScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SquadScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Squad</Text>
      <Text>Transform together 💪</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: '900', marginBottom: 16 },
});


// FILE: screens/ProfileScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUser } from '../context/UserContext';

export default function ProfileScreen() {
  const { profileName, profileAvatar, profileLevel, profileXP } = useUser();

  return (
    <View style={styles.container}>
      <Text style={styles.avatar}>{profileAvatar}</Text>
      <Text style={styles.name}>{profileName}</Text>
      <Text style={styles.level}>Level {profileLevel} · {profileXP} XP</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', padding: 24, paddingTop: 80 },
  avatar: { fontSize: 80 },
  name: { fontSize: 24, fontWeight: '900', marginTop: 16 },
  level: { fontSize: 14, color: '#64748b', marginTop: 4 },
});
