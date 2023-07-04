<script setup lang="ts">
import type { Message } from '~/electron/trpc/routers'

const { $trpc } = useNuxtApp()

const msgView = ref<HTMLElement>()
const { y } = useScroll(msgView, { behavior: 'smooth' })

const messages = reactive(new Map<string, Message>())
messages.set('first', {
  messageId: 'first',
  type: 'bot',
  text: "Je t'écoute.",
})

const loading = ref(false)
const error = ref<Error>()

const scrollDown = () => {
  y.value = msgView.value!.scrollHeight
}

const message$ = $trpc.message.subscribe(undefined, {
  onData(data) {
    loading.value = false

    messages.set(data.messageId, data)
    scrollDown()
  },
})

$trpc.isLoading.subscribe(undefined, {
  onData() {
    loading.value = true
    scrollDown()
  },
})

onUnmounted(() => {
  message$.unsubscribe()
})
</script>

<template>
  <div ref="msgView" class="font-mono space-y-2 py-3 px-5 text-sm w-full max-h-screen overflow-x-hidden overflow-y-auto">
    <div v-for="[_, message] of messages" :key="message.messageId" :class="message.type == 'user' ? 'text-gray-400' : 'text-gray-600'">
      {{ message.text }}
    </div>
    <div v-if="loading" class="animate-pulse bg-gray-300 h-4 rounded mt-1" />
    <div v-if="error" class="text-red-500">
      {{ error.message }}
    </div>
  </div>
</template>

<style>
body, html {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgba(255, 255, 255, 0.5);
}
</style>