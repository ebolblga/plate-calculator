export interface PlateObject {
    id: number
    weight: number
    innerDiameter: number
    outerDiameter: number
    height: number
}

export interface Result {
    unitOfWeight: 'kg' | 'lb'
    unitOfLength: 'm' | 'inch'
    numPlates: number
    totalWeight: number
    plateDenoms: PlateObject[]
}
