import * as THREE from 'three'
import type { PlateObject } from '@types'

export function createPlateMesh(plate: PlateObject): THREE.Mesh {
    const {
        innerDiameter,
        outerDiameter,
        height,
        weight, // if you want to color-code by weight
    } = plate

    const outerRadius = outerDiameter / 2
    const innerRadius = innerDiameter / 2

    // Makes a ring‐shape in 2D
    const shape = new THREE.Shape()
    shape.absarc(0, 0, outerRadius, 0, Math.PI * 2, false)

    const hole = new THREE.Path()
    hole.absarc(0, 0, innerRadius, 0, Math.PI * 2, true)
    shape.holes.push(hole)

    // Extrudes that ring into 3D
    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
        depth: height,
        bevelEnabled: false,
        steps: 1,
    }
    const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings)

    // Create material
    const mat = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        metalness: 0.6,
        roughness: 0.5,
    })

    return new THREE.Mesh(geom, mat)
}
