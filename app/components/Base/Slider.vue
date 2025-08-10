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
const editing = ref(false) // when true, show input instead of text
const inputRef = ref<HTMLInputElement | null>(null)

watch(
    () => props.modelValue,
    (v) => (internalValue.value = v)
)

function emitValue() {
    emit('update:modelValue', internalValue.value)
}

function startEditing() {
    editing.value = true
    // wait for DOM update then focus
    nextTick(() => {
        inputRef.value?.focus()
        inputRef.value?.select()
    })
}

function finishEditing() {
    // Clamp to min/max before emitting
    // const clamped = Math.min(max, Math.max(min, internalValue.value))
    const clamped = Math.max(min, internalValue.value)
    internalValue.value = clamped
    emitValue()
    editing.value = false
}
</script>

<template>
    <div class="space-y-2">
        <div class="flex justify-between items-center">
            <label :for="id" class="font-medium text-text/90">
                {{ label }}
            </label>

            <!-- Display mode -->
            <span
                v-if="!editing"
                class="font-mono text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded cursor-pointer"
                @click="startEditing">
                {{ props.modelValue }}
            </span>

            <!-- Editing mode -->
            <input
                v-else
                ref="inputRef"
                type="number"
                :min="min"
                :max="max"
                :step="step"
                v-model.number="internalValue"
                @blur="finishEditing"
                @keyup.enter="finishEditing"
                class="font-mono text-primary font-semibold bg-primary/10 px-1.5 py-0.5 rounded w-16 text-right" />
        </div>

        <input
            :id="id"
            type="range"
            :min="min"
            :max="max"
            :step="step"
            v-model.number="internalValue"
            @input="emitValue"
            class="w-full h-2 appearance-none cursor-pointer bg-secondary/50 rounded-full focus:outline-none transition-all duration-200 accent-primary hover:bg-secondary/70" />
    </div>
</template>
