import "./src/lib/dayjs";

import { StatusBar } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from "@expo-google-fonts/inter";
import * as Notifications from 'expo-notifications';

import { Routes } from "./src/routes";

import { Loading } from './src/components/Loading';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false
  })
});

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  });

  async function scheduleNotification() {
    const trigger = new Date(Date.now());
    trigger.setMinutes(trigger.getMinutes() + 1);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Habits ❤️",
        body: "Você praticou seus hábitos hoje?"
      },
      trigger
    })
  }

  async function getScheduledNotifications() {
    const schedule = await Notifications.getAllScheduledNotificationsAsync();
    console.log(schedule);
  }

  if(!fontsLoaded) return <Loading />;

  return (
    <>
      <Routes />
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/>
    </>
  );
}