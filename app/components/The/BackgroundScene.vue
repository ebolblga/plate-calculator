<script setup lang="ts">
// import { ChromaticAberrationShader } from 'three/examples/jsm/shaders/ChromaticAberrationShader.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { VignetteShader } from 'three/examples/jsm/shaders/VignetteShader.js'
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
let composer: EffectComposer
let frameId: number // for cancelAnimationFrame

// Creates scene, lights, weight plate‐stack group
function initScene() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x282828)
    plateGroup = new THREE.Group()
    scene.add(plateGroup)

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

    // const rgbPass = new ShaderPass(RGBShiftShader)
    // ;(rgbPass.uniforms as Record<string, any>)['amount'].value = 0.0015
    // ;(rgbPass.uniforms as Record<string, any>)['angle'].value = Math.PI / 4
    // composer.addPass(rgbPass)

    // const vigPass = new ShaderPass(VignetteShader)
    // ;(vigPass.uniforms as Record<string, any>)['offset'].value = 1
    // ;(vigPass.uniforms as Record<string, any>)['darkness'].value = 1.01
    // composer.addPass(vigPass)
}

// Rotate and zoom logic
function initControls() {
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(0, 0, 0)
    controls.enablePan = true
    controls.enableDamping = true // smooth motion
    controls.dampingFactor = 0.05
    controls.minDistance = 1
    controls.maxDistance = 5
    controls.rotateSpeed = 0.8
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
