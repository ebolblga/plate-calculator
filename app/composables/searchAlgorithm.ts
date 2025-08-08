export function getBinaryDenoms(targetNum: number): number[] {
    if (targetNum < 1) return []

    const denominations: number[] = []

    // Bit shift until it's bigger or equal to target number
    for (let powerOfTwo = 1; powerOfTwo <= targetNum; powerOfTwo <<= 1) {
        denominations.push(powerOfTwo)
    }

    return denominations
}

export function getCoverDenoms(targetNum: number): number[] {
    if (targetNum < 0 || !Number.isInteger(targetNum)) {
        throw new Error('target must be a non-negative integer')
    }

    const denominations: number[] = []
    let covered = 0

    // Keep adding a new weight until we've covered up to `target`
    while (covered < targetNum) {
        // Normally pick covered+1 so you extend the range to covered + (covered+1)
        let w = covered + 1

        // But if that overshoots, just pick exactly what's needed to reach `target`
        if (covered + w > targetNum) {
            w = targetNum - covered
        }

        denominations.push(w)
        covered += w
    }

    return denominations
}
