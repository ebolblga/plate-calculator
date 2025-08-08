<script setup lang="ts">
import { getBinaryDenoms } from '~/composables/searchAlgorithm'
import { useLocalStorage } from '@vueuse/core'

const minWeight = useLocalStorage<number>('min-weight', 0)
const maxWeight = useLocalStorage<number>('max-weight', 127)
const precision = useLocalStorage<number>('precision', 1)
const plateDenoms = ref<number[]>([])

function calculate(): void {
    if (minWeight > maxWeight) return

    // Clear previous result
    plateDenoms.value = []

    // Scale everything by precision to work in integers (divide by two, since barbell needs to be balanced)
    const unit: number = precision.value / 2

    // Normalize target number
    const targetNum: number = Math.round(
        (maxWeight.value - minWeight.value) / (unit * 2)
    )

    const denomsUnits: number[] = getBinaryDenoms(targetNum)

    plateDenoms.value = denomsUnits.map((u: number) => u * unit)
}
</script>
<template>
    <div class="">
        <p class="text-2xl font-bold">
            [Work in progress] Calculator for minimum amount of weight plates
            needed to get any value in a given range and precision.
        </p>
        <nav class="mt-3 mb-6 text-accent">
            <NuxtLink to="/about">{{ '<- About this project' }}</NuxtLink>
        </nav>
        <BaseSlider
            v-model="minWeight"
            :min="0"
            :max="1023"
            :step="1"
            label="Min weight, kg:"
            id="min-weight" />
        <BaseSlider
            v-model="maxWeight"
            :min="1"
            :max="1023"
            :step="1"
            label="Max weight, kg:"
            id="max-weight" />
        <BaseSlider
            v-model="precision"
            :min="0.25"
            :max="40"
            :step="0.25"
            label="Precision, kg:"
            id="precision" />
        <button
            @click="calculate"
            class="w-full py-1 bg-accent text-background mt-6">
            Calculate
        </button>
        <p class="mt-6">
            Weight plate denominations (2 each): {{ plateDenoms }}
        </p>
        <p>Total number of weight plates: {{ plateDenoms.length * 2 }}</p>
    </div>
</template>
