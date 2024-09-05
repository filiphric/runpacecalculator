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
          <Input id="pace" v-model="paceInput" @input="handlePaceInput" placeholder="mm:ss" data-testid="pace-input" />
        </div>
        <div v-if="calculationMode !== 'distance'" class="grid w-full items-center gap-1.5">
          <Label for="distance">Distance (km)</Label>
          <Input data-testid="distance-input" id="distance" v-model="distance" type="number" min="0" />
        </div>
        <div v-if="calculationMode !== 'time'" class="grid w-full items-center gap-1.5">
          <Label for="time">Time (hour:min)</Label>
          <Input id="time" v-model="timeInput" @input="handleTimeInput" placeholder="hh:mm" data-testid="time-input" />
        </div>
        <div class="mt-6">
          <Label>{{ calculationMode === 'time' ? 'Time' : calculationMode === 'distance' ? 'Distance' : 'Pace' }}</Label>
          <div class="flex h-14 w-full bg-background text-4xl font-extrabold justify-center items-center">
            <template v-if="calculationMode === 'time'">
              <div data-testid="time-output">{{ formattedTime }}</div>
            </template>
            <template v-else-if="calculationMode === 'distance'">
              <div data-testid="distance-output">{{ distance !== null ? distance.toFixed(2) + '  km' : ''  }} </div>
            </template>
            <template v-else>
              <div data-testid="pace-output">{{ formattedPace }}</div>
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

const calculationMode = ref('time')
const paceInput = ref('')
const pace = ref<number | null>(null)
const distance = ref<number | null>(null)
const timeInput = ref('')
const time = ref<number | null>(null)

const formatInputTime = (input: string): string => {
  const digits = input.replace(/\D/g, '').padStart(6, '0')
  const hours = parseInt(digits.slice(0, 2))
  const minutes = parseInt(digits.slice(2, 4))
  const seconds = parseInt(digits.slice(4, 6))

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  } else if (minutes > 0 || seconds > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }
  return ''
}

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
  const formattedInput = formatInputTime(input)
  paceInput.value = formattedInput
  handleTimeFormatInput(formattedInput, (value) => pace.value = value)
}

const handleTimeInput = (event: Event) => {
  const input = (event.target as HTMLInputElement).value
  const formattedInput = formatInputTime(input)
  timeInput.value = formattedInput
  handleTimeFormatInput(formattedInput, (value) => time.value = value)
}

const formatTimeValue = (value: number | null): string => {
  if (value === null) return ''
  const totalSeconds = Math.round(value * 60)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

const calculateResult = computed(() => {
  if (calculationMode.value === 'time' && pace.value !== null && distance.value !== null) {
    return pace.value * distance.value // Calculate time in minutes
  } else if (calculationMode.value === 'distance' && pace.value !== null && time.value !== null) {
    return time.value / (pace.value / 60) // Calculate distance in km
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
  // Reset all values whesn changing calculation mode
  paceInput.value = ''
  pace.value = null
  distance.value = null
  timeInput.value = ''
  time.value = null
})

const formattedPace = computed(() => {
  if (pace.value === null) return ''
  return `${formatTimeValue(pace.value)} min/km`
})

const formattedTime = computed(() => formatTimeValue(time.value))
</script>