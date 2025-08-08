import type { PlateObject } from '@types'

// TODO: rewrite this
export function genPlateObjects(plateDenoms: number[]): PlateObject[] {
    const DENSITY = 2400 // kg/m³
    const INNER_DIAMETER = 0.0504 // m
    const STANDARD_OD = 0.45 // m
    const MIN_HEIGHT = 0.02 // m
    const MIN_OD = 0.15 // m
    const MAX_OD = 0.5 // m

    const r = INNER_DIAMETER / 2

    return plateDenoms.map((weight, id) => {
        const V = weight / DENSITY // m³

        // 1) Try standard OD
        const R_std = STANDARD_OD / 2
        const h_std = V / (Math.PI * (R_std * R_std - r * r))

        let od: number
        let h: number

        if (h_std >= MIN_HEIGHT) {
            // standard OD is thick enough
            od = STANDARD_OD
            h = h_std
        } else {
            // 2) Compute OD_req that gives exactly MIN_HEIGHT
            const R_req = Math.sqrt(V / (Math.PI * MIN_HEIGHT) + r * r)
            const od_req = 2 * R_req

            // 3) Clamp OD_req
            od = Math.min(Math.max(od_req, MIN_OD), MAX_OD)

            // 4) Compute actual h at this OD
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
            innerDiameter: parseFloat(INNER_DIAMETER.toFixed(4)),
            outerDiameter: parseFloat(od.toFixed(4)),
            height: parseFloat(h.toFixed(4)),
        }
    })
}
