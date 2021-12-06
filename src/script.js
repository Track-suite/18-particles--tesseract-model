import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const particleTexture = textureLoader.load('/textures/particles/1.png')
const particleTexture1 = textureLoader.load('/textures/particles/9.png')
const boxTexture = textureLoader.load('/textures/particles/9.png')

/**
 * Particles
 */
//cube 
const cube = new THREE.SphereBufferGeometry(1,6,8,1)
//  const cube = new THREE.Mesh(
//     new THREE.SphereBufferGeometry(1,8,2),
//     // new THREE.MeshBasicMaterial({
//     //     normalMap: boxTexture,
//     //     transparent: false
        
//     // })
// )

const Boxmaterial = new THREE.PointsMaterial({

    size:0.5,
    color:0xffffff,
    sizeAttenuation: true
}
)
Boxmaterial.alphaMap = particleTexture1
Boxmaterial.transparent = true
Boxmaterial.depthTest = false
Boxmaterial.depthWrite = false
Boxmaterial.blending = THREE.AdditiveBlending

const cube2 = new THREE.Points(cube,Boxmaterial)
 scene.add(cube2)

 
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 20000



const positions = new Float32Array(count * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)
const colors = new Float32Array(count * 3)


for(let i = 0; i < count * 3; i++) // Multiply by 3 for same reason
{
    
    positions[i] = (Math.random() - 0.5) * 10 // Math.random() - 0.5 to have a random value between -0.5 and +0.5
    colors[i] = Math.random()//random colors
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) 
// Create the Three.js BufferAttribute and specify that each information is composed of 3 values

//particle2.setAttribute('position', new THREE.BufferAttribute(positions,3))//this is my particle added to check 

particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))//random color set

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.3,
    sizeAttenuation: true
    
})

//const 

particlesMaterial.vertexColors = true

particlesMaterial.size = 0.2
//particlesMaterial.color = new THREE.Color('#3495db')
// particlesMaterial.map = particleTexture
particlesMaterial.transparent = true
particlesMaterial.alphaMap = particleTexture

// particlesMaterial.alphaTest = 0.001
particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.2, 100)
camera.position.z = 8
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Update particles

    for(let i = 0; i < count; i++)
    {
        const i3 = i * 3

        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime)
    }
    particlesGeometry.attributes.position.needsUpdate = true 


    for(let i = 0; i < count; i++)
    {
        let i3 = i * 3

        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    }
    particlesGeometry.attributes.position.needsUpdate = true

    //particles.rotation.y = elapsedTime * 0.2
    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()