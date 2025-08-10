export interface PlateObject {
    id: number
    weight: number
    density: number
    innerDiameter: number
    outerDiameter: number
    height: number
}

// TODO: add lb/inch support
export interface Result {
    unitOfWeight: 'kg' | 'lb'
    unitOfLength: 'm' | 'ft'
    unitOfVolume: 'kg/m^3' | 'lb/ft^3'
    numPlates: number
    totalWeight: number
    totalHeight: number
    plateDenoms: PlateObject[]
}

export enum AlgoOptions {
    greedyCover = 'Greedy Subset-Sum Cover Algorithm',
    binaryHeuristic = 'Binary Heuristic',
    linear = 'Linear Increment Coverage',
}
