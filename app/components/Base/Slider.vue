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
    <label :for="id" class="block mb-2 text-text">
        {{ label }} {{ props.modelValue }}
    </label>
    <input
        :id="id"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        v-model.number="internalValue"
        @input="emitValue"
        class="w-full h-2 appearance-none cursor-pointer bg-secondary rounded-sm focus:outline-none transition-opacity accent-primary" />
</template>
