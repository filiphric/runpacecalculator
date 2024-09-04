<template>
  <div class="min-h-screen flex items-center justify-center dark:bg-slate-900 bg-gray-100">
    <div class="bg-background p-8 rounded-lg shadow-md w-full max-w-md dark:border dark:border-slate-700">
      <Tabs v-model="calculationMode" class="w-full">
        <TabsList class="grid w-full grid-cols-3">
          <TabsTrigger value="time">Time</TabsTrigger>
          <TabsTrigger value="distance">Distance</TabsTrigger>
          <TabsTrigger value="pace">Pace</TabsTrigger>
        </TabsList>
      </Tabs>
      <div class="space-y-4 mt-4">
        <div v-if="calculationMode !== 'pace'" class="grid w-full items-center gap-1.5">
          <Label for="pace">Pace (min:sec per km)</Label>
          <Input id="pace" v-model="paceInput" @input="handlePaceInput" placeholder="mm:ss" />
        </div>
        <div v-if="calculationMode !== 'distance'" class="grid w-full items-center gap-1.5">
          <Label for="distance">Distance (km)</Label>
          <Input id="distance" v-model="distance" type="number" step="0.01" min="0" />
        </div>
        <div v-if="calculationMode !== 'time'" class="grid w-full items-center gap-1.5">
          <Label for="time">Time (min:sec)</Label>
          <Input id="time" v-model="timeInput" @input="handleTimeInput" placeholder="mm:ss" />
        </div>
        <div class="mt-6">
          <Label>{{ calculationMode === 'time' ? 'Time' : calculationMode === 'distance' ? 'Distance' : 'Pace' }}</Label>
          <div class="flex h-14 w-full bg-background text-4xl font-extrabold justify-center items-center">
            <template v-if="calculationMode === 'time'">
              {{ formattedTime }}
            </template>
            <template v-else-if="calculationMode === 'distance'">
              {{ distance !== null ? distance.toFixed(2) : '' }} km
            </template>
            <template v-else>
              {{ formattedPace }} min/km
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'


const calculationMode = ref('time')
const paceInput = ref('')
const pace = ref<number | null>(null)
const distance = ref<number | null>(null)
const timeInput = ref('')
const time = ref<number | null>(null)

const handleTimeFormatInput = (input: string, updateRef: (value: number | null) => void) => {
  const regex = /^(\d{1,2}):([0-5]\d)$/
  
  if (regex.test(input) || input === '') {
    if (input !== '') {
      const [minutes, seconds] = input.split(':').map(Number)
      updateRef(minutes + seconds / 60)
    } else {
      updateRef(null)
    }
    return true
  }
  return false
}

const handlePaceInput = (event: Event) => {
  const input = (event.target as HTMLInputElement).value
  if (handleTimeFormatInput(input, (value) => pace.value = value)) {
    paceInput.value = input
  }
}

const handleTimeInput = (event: Event) => {
  const input = (event.target as HTMLInputElement).value
  if (handleTimeFormatInput(input, (value) => time.value = value)) {
    timeInput.value = input
  }
}

const formatTimeValue = (value: number | null): string => {
  if (value === null) return ''
  const totalSeconds = Math.round(value * 60)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const calculateResult = computed(() => {
  if (calculationMode.value === 'time' && pace.value !== null && distance.value !== null) {
    return pace.value * distance.value // Calculate time in minutes
  } else if (calculationMode.value === 'distance' && pace.value !== null && time.value !== null) {
    return (time.value / pace.value) // Calculate distance in km
  } else if (calculationMode.value === 'pace' && time.value !== null && distance.value !== null) {
    return time.value / distance.value // Calculate pace in minutes per km
  }
  return null
})

watch(calculateResult, (newValue) => {
  if (newValue !== null) {
    if (calculationMode.value === 'time') {
      time.value = newValue
      timeInput.value = formatTimeValue(newValue)
    } else if (calculationMode.value === 'distance') {
      distance.value = Number(newValue.toFixed(2))
    } else if (calculationMode.value === 'pace') {
      pace.value = newValue
      paceInput.value = formatTimeValue(newValue)
    }
  }
})

watch(calculationMode, () => {
  // Reset values when changing calculation mode
  if (calculationMode.value === 'time') {
    timeInput.value = ''
    time.value = null
  } else if (calculationMode.value === 'distance') {
    distance.value = null
  } else if (calculationMode.value === 'pace') {
    paceInput.value = ''
    pace.value = null
  }
})

const formattedPace = computed(() => {
  if (pace.value === null) return ''
  return `${formatTimeValue(pace.value)}`
})

const formattedTime = computed(() => formatTimeValue(time.value))
</script>