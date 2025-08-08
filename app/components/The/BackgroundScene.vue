<script setup lang="ts">
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import * as THREE from 'three'
import type { Result } from '@types'

const props = defineProps<{ result: Result }>()

const sceneContainer = ref<HTMLElement | null>(null)

// Core Three.js objects
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let plateGroup: THREE.Group // group that will hold stack of plates
let labelGroup: THREE.Group // group that will hold weight labels
let composer: EffectComposer
let frameId: number // for cancelAnimationFrame

// Creates scene, lights, weight plate‐stack group
function initScene() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x282828)
    plateGroup = new THREE.Group()
    scene.add(plateGroup)

    labelGroup = new THREE.Group()
    scene.add(labelGroup)

    scene.add(new THREE.AmbientLight(0xffffff, 0.6))
    const dir = new THREE.DirectionalLight(0xffffff, 1)
    dir.position.set(1, 0.2, 1)
    scene.add(dir)
}

// Sets up perspective camera
function initCamera() {
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )

    camera.position.set(0.1, -0.05, 0.1)
    camera.lookAt(0, 0, 0)

    const fullW = window.innerWidth
    const fullH = window.innerHeight
    const shiftX = Math.round(fullW * -0.2) // 20% of screen width
    camera.setViewOffset(fullW, fullH, shiftX, 0, fullW, fullH)
}

// Creates and appends WebGLRenderer
function initRenderer() {
    if (!sceneContainer.value) throw new Error('No container')

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    sceneContainer.value.appendChild(renderer.domElement)

    initPostProcessing()
}

function initPostProcessing() {
    composer = new EffectComposer(renderer)

    // Base render pass with explicit clear color/alpha
    const renderPass = new RenderPass(scene, camera)
    renderPass.clearColor = new THREE.Color(0x282828)
    renderPass.clearAlpha = 1.0
    composer.addPass(renderPass)

    const bloom = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.5,
        0.4,
        0.6
    )
    composer.addPass(bloom)
}

// Rotate and zoom logic
function initControls() {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.enablePan = true
    controls.enableDamping = true // smooth motion
    controls.dampingFactor = 0.05
    controls.minDistance = 1
    controls.maxDistance = 4
    controls.rotateSpeed = 0.8
}

// Creates a text label sprite that always faces the camera
function createTextLabel(text: string): THREE.Sprite {
    // Create a canvas to render text
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')!

    // Set canvas size
    canvas.width = 128
    canvas.height = 64

    // Configure text style
    context.font = '600 24px Inter, sans-serif'
    context.fillStyle = '#f4e3e3'
    context.textAlign = 'center'
    context.textBaseline = 'middle'

    // Clear canvas
    context.clearRect(0, 0, canvas.width, canvas.height)

    // Draw text
    context.fillText(text, canvas.width / 2, canvas.height / 2)

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true

    // Create sprite material
    const material = new THREE.SpriteMaterial({
        map: texture,
        transparent: true
    })

    // Create and configure sprite
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(0.12, 0.06, 1)

    return sprite
}

// Builds stack of weight plates
function loadPlates() {
    clearPlates()

    if (!props.result.plateDenoms) return

    const plateSpacing = 0.1

    // Sort from heavies to lightest.
    const plates = [...props.result.plateDenoms].sort(
        (a, b) => b.weight - a.weight
    )

    // Calculate total height of all plates
    const totalHeight = plates.reduce(
        (sum, p) => sum + p.height + plateSpacing,
        0
    )

    // Start half of total height below zero
    let yOffset = -totalHeight / 2

    // Stack sorted plates
    for (const plate of plates) {
        const mesh = createPlateMesh(plate)

        // Rotate plate
        mesh.rotation.x = Math.PI / 2

        // Position so the stack is centered at y = 0
        mesh.position.y = yOffset + plate.height / 2

        plateGroup.add(mesh)

        // Create and position weight label
        const weightText = `${plate.weight}${props.result.unitOfWeight}`
        const label = createTextLabel(weightText)

        // Position label next to the plate
        label.position.set(
            plate.outerDiameter / 2 + 0.15,
            yOffset + plate.height / 2,
            0
        )

        labelGroup.add(label)

        yOffset += plate.height + plateSpacing
    }
}

function clearPlates() {
    // Remove all previous meshes
    while (plateGroup.children.length) {
        const child = plateGroup.children.pop()!
        if ((child as THREE.Mesh).geometry)
            (child as THREE.Mesh).geometry.dispose()
        if ((child as THREE.Mesh).material) {
            const mat = (child as THREE.Mesh).material
            if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
            else mat.dispose()
        }
    }

    // Remove all previous labels
    while (labelGroup.children.length) {
        const child = labelGroup.children.pop()!
        if ((child as THREE.Sprite).material) {
            const mat = (child as THREE.Sprite).material as THREE.SpriteMaterial
            if (mat.map) mat.map.dispose()
            mat.dispose()
        }
    }
}

// Render loop
function animate() {
    controls.update()
    composer.render()
    frameId = requestAnimationFrame(animate)
}

// Window resize handler
function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

// Lifecycle
onMounted(() => {
    initScene()
    initCamera()
    initRenderer()
    initControls()
    loadPlates()

    watch(
        () => props.result.plateDenoms,
        (newPlates) => {
            if (newPlates) loadPlates()
        },
        { deep: true }
    )

    window.addEventListener('resize', onResize)
    animate()
})

// Cleanup
onBeforeUnmount(() => {
    cancelAnimationFrame(frameId)
    window.removeEventListener('resize', onResize)
    renderer.dispose()
})
</script>
<template>
    <div
        ref="sceneContainer"
        class="w-screen h-screen m-0 p-0 overflow-hidden fixed inset-0 -z-10"></div>
</template>
