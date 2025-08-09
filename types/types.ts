export interface PlateObject {
    id: number
    weight: number
    innerDiameter: number
    outerDiameter: number
    height: number
}

// TODO: add lb/inch support
export interface Result {
    unitOfWeight: 'kg' | 'lb'
    unitOfLength: 'm' | 'inch'
    numPlates: number
    totalWeight: number
    totalHeight: number
    plateDenoms: PlateObject[]
}

export enum AlgoOptions {
    greedyCover = 'Greedy subset-sum cover algorithm',
    binaryHeuristic = 'Binary heuristic',
}
