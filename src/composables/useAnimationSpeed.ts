import { ref, computed } from 'vue'

export function useAnimationSpeed(defaultSpeed = 1.0, minSpeed = 0.25, maxSpeed = 2.0, step = 0.25) {
  const animationSpeed = ref(defaultSpeed)

  const animationSpeedStyle = computed(() => ({
    '--animation-speed': animationSpeed.value
  }))

  const increaseAnimationSpeed = () => {
    if (animationSpeed.value < maxSpeed) {
      animationSpeed.value = Math.min(maxSpeed, animationSpeed.value + step)
    }
  }

  const decreaseAnimationSpeed = () => {
    if (animationSpeed.value > minSpeed) {
      animationSpeed.value = Math.max(minSpeed, animationSpeed.value - step)
    }
  }

  const resetAnimationSpeed = () => {
    animationSpeed.value = defaultSpeed
  }

  const setAnimationSpeed = (speed: number) => {
    animationSpeed.value = Math.max(minSpeed, Math.min(maxSpeed, speed))
  }

  return {
    animationSpeed,
    animationSpeedStyle,
    increaseAnimationSpeed,
    decreaseAnimationSpeed,
    resetAnimationSpeed,
    setAnimationSpeed
  }
}
