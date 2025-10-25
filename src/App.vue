<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, onUnmounted, ref, computed } from 'vue'

const currentTime = ref(new Date())
let timerId = null

const secondsUntilNextMinute = computed(() => {
  const seconds = 60 - currentTime.value.getSeconds()
  return String(seconds % 60).padStart(2, '0')
})

onMounted(() => {
  timerId = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timerId)
})
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/vote">Vote</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
      <div>Voting for People... reimagined</div>
      <div class="time-container">
        <div class="countdown">Next update: {{ secondsUntilNextMinute }}s</div>
        <div class="time-display">{{ currentTime.toLocaleTimeString() }}</div>
      </div>
    </div>
  </header>

  <RouterView />
</template>


<style scoped>
header {
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 0 2rem;
  position: sticky;
  top: 0;
  z-index: 10;
}

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
}

nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
}

nav a,
nav button {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  transition: background-color 0.3s;
}

nav a:hover,
nav button:hover {
  background-color: #f0f0f0;
}

.time-display {
  font-size: 1rem;
  color: #333;
}

.time-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.countdown {
  font-size: 0.9rem;
  color: #666;
  background-color: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.clicks-remaining {
  font-size: 1rem;
  color: #333;
}
</style>