export function getBinaryDenoms(targetNum: number): number[] {
    if (targetNum < 1) return []

    const denominations: number[] = []

    // Bit shift untill it's bigger or equal to target number
    for (let powerOfTwo = 1; powerOfTwo <= targetNum; powerOfTwo <<= 1) {
        denominations.push(powerOfTwo)
    }

    return denominations
}
