<script setup lang="ts">
import { genPlateObjects } from '~/composables/generatePlates'
import {
    getCoverDenoms,
    getBinaryDenoms,
    getLinearDenoms,
} from '~/composables/searchAlgorithm'
import { useLocalStorage, useDebounceFn } from '@vueuse/core'
import { type Result, AlgoOptions } from '@types'

useSeoMeta({
    title: 'Plate Calculator',
    description:
        'Calculate the minimum number of weight plates needed for any weight range. Optimize your home gym setup with our advanced plate calculator tool. Perfect for DIY gym equipment and weight plate optimization.',
    keywords:
        'weight plates, gym equipment, plate calculator, home gym, barbell weights, fitness calculator, weight optimization, DIY gym, weight plate calculator',
    author: 'Plate Calculator',
    robots: 'index, follow',
    ogTitle: 'Plate Calculator - Weight Plate Optimization Tool',
    ogDescription:
        'Calculate the minimum number of weight plates needed for any weight range. Optimize your home gym setup with our advanced plate calculator tool.',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Plate Calculator - Weight Plate Optimization Tool',
    twitterDescription:
        'Calculate the minimum number of weight plates needed for any weight range. Optimize your home gym setup with our advanced plate calculator tool.',
})

useHead({
    script: [
        {
            type: 'application/ld+json',
        },
    ],
})

const minWeight = useLocalStorage<number>('min-weight', 20)
const maxWeight = useLocalStorage<number>('max-weight', 178.75)
const precision = useLocalStorage<number>('precision', 1.25)
const plateDenoms = ref<number[]>([])
const result = useLocalStorage<Result>('result', {} as Result)
const selectedAlgo = useLocalStorage<AlgoOptions>(
    'selected-algo',
    AlgoOptions.greedyCover
)

const route = useRoute()
const router = useRouter()
let updatingQuery = false // a flag to avoid echo/loop when we programmatically replace the route/query

function algoKeyFromValue(v: AlgoOptions) {
    const found = Object.entries(AlgoOptions).find(([, val]) => val === v)
    return found?.[0] ?? 'greedyCover'
}

function algoValueFromKey(
    key: string | null | undefined
): AlgoOptions | undefined {
    if (!key) return undefined
    return (AlgoOptions as any)[key] as AlgoOptions | undefined
}

// Query has higher priority than localStorage — this is called once on load and also when route.query changes
function applyQueryToState(q: Record<string, any>) {
    if (q.min !== undefined) {
        const n = Number(q.min)
        if (!Number.isNaN(n)) minWeight.value = n
    }
    if (q.max !== undefined) {
        const n = Number(q.max)
        if (!Number.isNaN(n)) maxWeight.value = n
    }
    if (q.prec !== undefined) {
        const n = Number(q.prec)
        if (!Number.isNaN(n)) precision.value = n
    }
    if (q.algo !== undefined) {
        const maybeAlgo = algoValueFromKey(String(q.algo))
        if (maybeAlgo) selectedAlgo.value = maybeAlgo
    }
}

watch(
    [minWeight, maxWeight, precision, selectedAlgo],
    ([min, max, prec, algo]) => {
        if (updatingQuery) return
        const algoKey = algoKeyFromValue(unref(algo))

        // Build the new query object. Convert numbers/enum->key to strings for URL.
        const newQuery = {
            ...Object.fromEntries(Object.entries(route.query)), // keep any other query params
            min: String(unref(min)),
            max: String(unref(max)),
            prec: String(unref(prec)),
            algo: algoKey,
        }

        // Avoid unnecessary router.replace if query is already identical
        const same =
            String(route.query.min ?? '') === newQuery.min &&
            String(route.query.max ?? '') === newQuery.max &&
            String(route.query.prec ?? '') === newQuery.prec &&
            String(route.query.algo ?? '') === newQuery.algo

        if (!same) {
            updatingQuery = true
            // replace so we don't create history entries for each small change
            router.replace({ query: newQuery }).finally(() => {
                updatingQuery = false
            })
        }
    },
    { deep: true }
)

// Watch route.query so back/forward or external link changes get applied to state.
watch(
    () => route.query,
    (q) => {
        if (updatingQuery) return
        applyQueryToState(q as Record<string, any>)
    },
    { immediate: false, deep: true }
)

onMounted(() => {
    applyQueryToState(route.query as Record<string, any>)
    findPlateDenoms()
})

const debouncedFindPlateDenoms = useDebounceFn(findPlateDenoms, 200)

watch(selectedAlgo, () => {
    findPlateDenoms()
})

watch([minWeight, maxWeight, precision], () => {
    debouncedFindPlateDenoms()
})

// Ensures minWeight never exceeds maxWeight
watch(minWeight, (val) => {
    if (val > maxWeight.value) {
        maxWeight.value = val
    }
})

// Ensures maxWeight never goes below minWeight
watch(maxWeight, (val) => {
    if (val < minWeight.value) {
        minWeight.value = val
    }
})

function findPlateDenoms(): void {
    if (minWeight > maxWeight) return

    // Clear previous result
    plateDenoms.value = []

    // Scale everything by precision to work in integers (divide by two, since barbell needs to be balanced)
    const unit: number = precision.value / 2

    // Normalize target number
    const targetNum: number = Math.round(
        (maxWeight.value - minWeight.value) / (unit * 2)
    )

    let denomsUnits: number[] = []

    switch (selectedAlgo.value) {
        case AlgoOptions.greedyCover: {
            denomsUnits = getCoverDenoms(targetNum)
            break
        }

        case AlgoOptions.binaryHeuristic: {
            denomsUnits = getBinaryDenoms(targetNum)
            break
        }

        case AlgoOptions.linear: {
            denomsUnits = getLinearDenoms(targetNum)
            break
        }

        default:
            denomsUnits = getCoverDenoms(targetNum)
    }

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
        totalHeight:
            plateObjects.reduce((acc, curr) => (acc += curr.height), 0) * 2,
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
        <p class="text-lg lg:text-2xl font-bold">plate-calculator</p>
        <p class="italic hidden lg:block">
            Calculator for minimum amount of weight plates needed to get any
            value in a given range and precision
        </p>
        <nav class="mt-3 mb-4 text-accent">
            <NuxtLink to="/about">{{ '<- About this project' }}</NuxtLink>
        </nav>
        <section class="mb-4">
            <div
                class="bg-background/30 backdrop-blur-sm rounded-lg p-3 border border-text/10">
                <div class="space-y-1">
                    <label
                        class="flex items-center gap-2 cursor-pointer hover:bg-background/20 rounded p-1 transition-colors">
                        <input
                            type="radio"
                            :value="AlgoOptions.greedyCover"
                            v-model="selectedAlgo"
                            class="w-4 h-4 bg-background accent-primary" />
                        {{ AlgoOptions.greedyCover }}
                    </label>
                    <label
                        class="flex items-center gap-2 cursor-pointer hover:bg-background/20 rounded p-1 transition-colors">
                        <input
                            type="radio"
                            :value="AlgoOptions.binaryHeuristic"
                            v-model="selectedAlgo"
                            class="w-4 h-4 bg-background accent-primary" />
                        {{ AlgoOptions.binaryHeuristic }}
                    </label>
                    <label
                        class="flex items-center gap-2 cursor-pointer hover:bg-background/20 rounded p-1 transition-colors">
                        <input
                            type="radio"
                            :value="AlgoOptions.linear"
                            v-model="selectedAlgo"
                            class="w-4 h-4 bg-background accent-primary" />
                        {{ AlgoOptions.linear }}
                    </label>
                </div>
            </div>
        </section>
        <section class="mb-4 min-h-[154px]">
            <client-only>
                <div
                    class="space-y-2 bg-background/30 backdrop-blur-sm rounded-lg px-3 py-2 border border-text/10">
                    <BaseSlider
                        v-model="minWeight"
                        :min="0"
                        :max="1000"
                        :step="1"
                        label="Min weight, kg:"
                        id="min-weight" />
                    <BaseSlider
                        v-model="maxWeight"
                        :min="0"
                        :max="1000"
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
                </div>
            </client-only>
        </section>
        <section class="w-full mt-4 flex justify-center">
            <BaseButton @click="exportJson">
                <Icon name="mdi:code-json" size="16" />
                Download JSON
            </BaseButton>
        </section>
        <section class="mt-4">
            <client-only>
                <div
                    class="backdrop-blur-sm rounded-lg p-3 border border-text/20 space-y-2">
                    <h3 class="text-sm font-semibold mb-2">Results</h3>

                    <div class="grid grid-cols-3 gap-2 text-xs">
                        <div class="text-center">
                            <div>Plates</div>
                            <div class="text-primary font-mono">
                                {{ result.numPlates }}
                            </div>
                        </div>

                        <div class="text-center">
                            <div>Weight</div>
                            <div class="text-primary font-mono">
                                {{ result.totalWeight }}kg
                            </div>
                        </div>

                        <div class="text-center">
                            <div>Height</div>
                            <div class="text-primary font-mono">
                                {{ result.totalHeight.toPrecision(3) }}m
                            </div>
                        </div>
                    </div>

                    <div class="pt-1">
                        <div class="text-xs mb-1">Denominations:</div>
                        <div class="flex flex-wrap gap-1">
                            <span
                                v-for="(denom, i) in plateDenoms"
                                :key="`${denom}-${i}`"
                                class="bg-primary/20 text-primary px-1.5 py-0.5 rounded text-xs font-mono border border-primary/30">
                                2x{{ denom }}kg
                            </span>
                        </div>
                    </div>
                </div>
            </client-only>
        </section>
    </div>
</template>
