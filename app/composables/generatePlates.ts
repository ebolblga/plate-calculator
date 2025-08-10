import type { PlateObject } from '@types'
import {
    DENSITY,
    INNER_DIAMETER,
    STANDARD_OD,
    MIN_HEIGHT,
    MIN_OD,
    MAX_OD,
} from '@constants'

// TODO: rewrite this
export function genPlateObjects(plateDenoms: number[]): PlateObject[] {
    const r = INNER_DIAMETER / 2

    return plateDenoms.map((weight, id) => {
        const V = weight / DENSITY // m^3

        // Try standard outer diameter
        const R_std = STANDARD_OD / 2
        const h_std = V / (Math.PI * (R_std * R_std - r * r))

        let od: number
        let h: number

        if (h_std >= MIN_HEIGHT) {
            // Standard outer diameter is thick enough
            od = STANDARD_OD
            h = h_std
        } else {
            // Compute OD_req that gives exactly MIN_HEIGHT
            const R_req = Math.sqrt(V / (Math.PI * MIN_HEIGHT) + r * r)
            const od_req = 2 * R_req

            // Clamp OD_req
            od = Math.min(Math.max(od_req, MIN_OD), MAX_OD)

            // Compute actual h at this OD
            const R = od / 2
            h = V / (Math.PI * (R * R - r * r))

            // If it's still below min height (because od got clamped), force it
            if (h < MIN_HEIGHT) {
                h = MIN_HEIGHT
            }
        }

        return {
            id,
            weight,
            density: DENSITY,
            innerDiameter: parseFloat(INNER_DIAMETER.toFixed(4)),
            outerDiameter: parseFloat(od.toFixed(4)),
            height: parseFloat(h.toFixed(4)),
        }
    })
}
