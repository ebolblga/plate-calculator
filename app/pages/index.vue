<script setup lang="ts">
import { genPlateObjects } from '~/composables/generatePlates'
import { getBinaryDenoms, getCoverDenoms } from '~/composables/searchAlgorithm'
import { useLocalStorage } from '@vueuse/core'
import type { Result } from '@types'

useSeoMeta({
    title: 'plate-calculator',
})

const minWeight = useLocalStorage<number>('min-weight', 20)
const maxWeight = useLocalStorage<number>('max-weight', 140)
const precision = useLocalStorage<number>('precision', 1)
const plateDenoms = ref<number[]>([])
const result = useLocalStorage<Result>('result', {} as Result)

onMounted(() => {
    findPlateDenoms()
})

function findPlateDenoms(heuristic: boolean = false): void {
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

    const plateDenominations: number[] = denomsUnits
        .map((u: number) => u * unit)
        .sort((a, b) => a - b)

    plateDenoms.value = plateDenominations
    const plateObjects = genPlateObjects(plateDenominations)

    result.value = {
        unitOfWeight: 'kg',
        unitOfLength: 'm',
        numPlates: plateDenominations.length * 2,
        totalWeight:
            plateDenominations.reduce(
                (accumulator, currentValue) => accumulator + currentValue,
                0
            ) * 2,
        plateDenoms: plateObjects,
    }
}

function exportJson() {
    const data = result.value
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'plate_data.json'
    a.click()
    URL.revokeObjectURL(url)
}
</script>
<template>
    <TheBackgroundScene :result="result" />
    <div class="p-3 absolute top-0 left-0 z-20 select-none w-1/2">
        <p class="text-2xl font-bold">[WIP] plate-calculator</p>
        <p>
            Calculator for minimum amount of weight plates needed to get any
            value in a given range and precision (best viewed on desktop)
        </p>
        <nav class="mt-3 mb-6 text-accent">
            <NuxtLink to="/about">{{ '<- About this project' }}</NuxtLink>
        </nav>
        <section class="h-[150px]">
            <client-only>
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
            </client-only>
        </section>
        <section class="w-full mt-6 flex flex-row gap-x-1">
            <BaseButton
                @click="findPlateDenoms()"
                class="w-1/3">
                Greedy Subset-Sum Cover algorithm
            </BaseButton>
            <BaseButton
                @click="findPlateDenoms(true)"
                class="w-1/3">
                Binary heuristic
            </BaseButton>
            <BaseButton @click="exportJson" class="w-1/3">
                Download JSON with dimensions
            </BaseButton>
        </section>
        <section>
            <client-only>
                <p class="mt-6">
                    Weight plate denominations (2 each): {{ plateDenoms }}
                </p>
                <p>
                    Total number of weight plates: {{ plateDenoms.length * 2 }}
                </p>
                <p>
                    Total weight, kg:
                    {{ plateDenoms.reduce((acc, curr) => acc + curr, 0) * 2 }}
                </p>
                <!-- <pre v-if="result">{{ JSON.stringify(result, null, 2) }}</pre> -->
            </client-only>
        </section>
    </div>
</template>
