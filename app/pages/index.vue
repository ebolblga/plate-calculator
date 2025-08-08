<script setup lang="ts">
import { getBinaryDenoms, getCoverDenoms } from '~/composables/searchAlgorithm'
import { useLocalStorage } from '@vueuse/core'

const minWeight = useLocalStorage<number>('min-weight', 20)
const maxWeight = useLocalStorage<number>('max-weight', 140)
const precision = useLocalStorage<number>('precision', 1)
const plateDenoms = ref<number[]>([])

function calculate(heuristic: boolean = false): void {
    if (minWeight > maxWeight) return

    // Clear previous result
    plateDenoms.value = []

    // Scale everything by precision to work in integers (divide by two, since barbell needs to be balanced)
    const unit: number = precision.value / 2

    // Normalize target number
    const targetNum: number = Math.round(
        (maxWeight.value - minWeight.value) / (unit * 2)
    )

    const denomsUnits: number[] = heuristic
        ? getBinaryDenoms(targetNum)
        : getCoverDenoms(targetNum)

    plateDenoms.value = denomsUnits
        .map((u: number) => u * unit)
        .sort((a, b) => a - b)
}

function validateAnswer(nums: number[] = plateDenoms.value): void {
    const result = new Set<number>()

    const dfs = (index: number, currentSum: number) => {
        if (index === nums.length) {
            result.add(currentSum * 2 + minWeight.value)
            return
        }

        // @ts-ignore
        dfs(index + 1, currentSum + nums[index])

        // Exclude nums[index]
        dfs(index + 1, currentSum)
    }

    dfs(0, 0)

    console.log(Array.from(result).sort((a, b) => a - b))
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
            @click="calculate()"
            class="w-full py-1 bg-accent text-background mt-6">
            Greedy Subset-Sum Cover algorithm
        </button>
        <button
            @click="calculate(true)"
            class="w-full py-1 bg-accent text-background mt-6">
            Binary heuristic
        </button>
        <button
            @click="validateAnswer()"
            class="w-full py-1 bg-accent text-background mt-6">
            Validate
        </button>
        <p class="mt-6">
            Weight plate denominations (2 each): {{ plateDenoms }}
        </p>
        <p>Total number of weight plates: {{ plateDenoms.length * 2 }}</p>
    </div>
</template>
