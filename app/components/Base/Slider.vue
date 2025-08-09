<script setup lang="ts">
const props = defineProps<{
    modelValue: number
    min?: number
    max?: number
    step?: number
    label?: string
    id?: string
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', val: number): void
}>()

const min = props.min ?? 0
const max = props.max ?? 100
const step = props.step ?? 1
const id = props.id ?? `slider-${Math.random().toString(36).substr(2, 5)}`

const internalValue = ref(props.modelValue)

watch(
    () => props.modelValue,
    (v) => (internalValue.value = v)
)

function emitValue() {
    emit('update:modelValue', internalValue.value)
}
</script>
<template>
    <div class="space-y-2">
        <div class="flex justify-between items-center">
            <label :for="id" class="font-medium text-text/90">
                {{ label }}
            </label>
            <span
                class="font-mono text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded">
                {{ props.modelValue }}
            </span>
        </div>
        <input
            :id="id"
            type="range"
            :min="min"
            :max="max"
            :step="step"
            v-model.number="internalValue"
            @input="emitValue"
            class="w-full h-2 appearance-none cursor-pointer bg-secondary/50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all duration-200 accent-primary hover:bg-secondary/70" />
    </div>
</template>
