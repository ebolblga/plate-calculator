<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as THREE from 'three'

const sceneContainer = ref<HTMLElement | null>(null)

// core three.js objects
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let plateGroup: THREE.Group // group that will hold stack of plates
let frameId: number // for cancelAnimationFrame

// Creates scene, lights, weight plate‐stack group
function initScene() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf0f0f0)
    plateGroup = new THREE.Group()
    scene.add(plateGroup)

    const ambient = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambient)
}

// Sets up perspective camera
function initCamera() {
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.set(0, 0, 10)
    camera.lookAt(0, 0, 0)
}

// Creates and appends WebGLRenderer
function initRenderer() {
    if (!sceneContainer.value) throw new Error('No container')

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    sceneContainer.value.appendChild(renderer.domElement)
}

// Rotate and zoom logic
function initControls() {
    // placeholder: later, set up OrbitControls here,
}

// Builds stack of weight plates
function loadPlates() {
    // placeholder: build stack of weight-plates here
}

// Render loop
function animate() {
    renderer.render(scene, camera)
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
        class="w-screen h-screen m-0 p-0 overflow-hidden"></div>
</template>
