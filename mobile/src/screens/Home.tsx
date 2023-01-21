import { useCallback, useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

import { api } from "../lib/axios";

import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";

import { DAY_SIZE, HabitDay } from "../components/HabitDay";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import dayjs from "dayjs";

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const dateFromYearStart = generateDatesFromYearBeginning();
const minimumSummaryDatesSize = 18 * 5;
const amountOfDaysToFill = minimumSummaryDatesSize - dateFromYearStart.length;

type Summary = Array<{
  id: string;
  date: string;
  amount: number;
  completed: number;
}>

export function Home() {
  const { navigate } = useNavigation();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<Summary | null>(null);

  async function fetchData() {
    try {
      setLoading(true);
      const res = await api.get('/summary');
      setSummary(res.data);
    } catch(err) {
      Alert.alert('Ops', "Não foi possível carregar o sumário de hábitos.")
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(useCallback(() => {
    fetchData();
  }, []))

  if(loading) return <Loading />

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDays.map((weekDay, i) => (
          <Text 
            key={`${weekDay}-${i}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {
          summary &&
          <View className="flex-row flex-wrap">
            {dateFromYearStart.map(date => {
              const dayWithHabits = summary.find(day => dayjs(date).isSame(day.date, 'day'));

              return (
                <HabitDay 
                  date={date}
                  amountOfHabits={dayWithHabits?.amount}
                  amountCompleted={dayWithHabits?.completed}
                  key={date.toISOString()}
                  onPress={() => { navigate('habit', { date: date.toISOString() }); }}
                />
              )
            })}
            {
              amountOfDaysToFill > 0 && Array.from({ length: amountOfDaysToFill }).map((_, i) => (
                <View 
                  key={i}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                />
              ))
            }
          </View>
        }
      </ScrollView>
    </View>
  )
}