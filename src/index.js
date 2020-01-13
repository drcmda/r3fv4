import * as THREE from 'three'
import ReactDOM from 'react-dom'
import React, { Suspense, useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import lerp from 'lerp'
import Text from './Text'
import Effects from './Effects'
import Sparks from './Sparks'
import Particles from './Particles'
import './styles.css'

function Ellipse(props) {
  const geometry = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, 10, 3, 0, 2 * Math.PI, false, 0)
    const points = curve.getPoints(50)
    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])
  return (
    <line geometry={geometry} {...props}>
      <meshBasicMaterial attach="material" />
    </line>
  )
}

function ReactAtom(props) {
  return (
    <group {...props}>
      <Ellipse />
      <Ellipse rotation={[0, 0, Math.PI / 3]} />
      <Ellipse rotation={[0, 0, -Math.PI / 3]} />
      <mesh>
        <sphereBufferGeometry attach="geometry" args={[0.5, 32, 32]} />
        <meshBasicMaterial attach="material" color="red" />
      </mesh>
    </group>
  )
}

function Number({ mouse, hover }) {
  const ref = useRef()
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width
  useFrame(state => {
    if (ref.current) {
      ref.current.position.x = lerp(ref.current.position.x, mouse.current[0] / aspect / 10, 0.1)
      ref.current.rotation.x = lerp(ref.current.rotation.x, 0 + mouse.current[1] / aspect / 50, 0.1)
      ref.current.rotation.y = 0.8
    }
  })
  return (
    <Suspense fallback={null}>
      <group ref={ref}>
        <Text
          size={10}
          onClick={e => window.open('https://github.com/react-spring/react-three-fiber/blob/master/whatsnew.md', '_blank')}
          onPointerOver={() => hover(true)}
          onPointerOut={() => hover(false)}>
          4
        </Text>
        <ReactAtom position={[35, -20, 0]} scale={[1, 0.5, 1]} />
      </group>
    </Suspense>
  )
}

function App() {
  const [hovered, hover] = useState(false)
  const [down, set] = useState(false)
  const mouse = useRef([0, 0])
  const onMouseMove = useCallback(({ clientX: x, clientY: y }) => (mouse.current = [x - window.innerWidth / 2, y - window.innerHeight / 2]), [])
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  useEffect(() => {
    document.body.style.cursor = hovered
      ? 'pointer'
      : "url('https://raw.githubusercontent.com/chenglou/react-motion/master/demos/demo8-draggable-list/cursor.png') 39 39, auto"
  }, [hovered])

  return (
    <>
      <Canvas
        pixelRatio={Math.min(2, isMobile ? window.devicePixelRatio : 1)}
        camera={{ fov: 100, position: [0, 0, 30] }}
        onMouseMove={onMouseMove}
        onMouseUp={() => set(false)}
        onMouseDown={() => set(true)}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.Uncharted2ToneMapping
          gl.setClearColor(new THREE.Color('#020207'))
        }}>
        <pointLight distance={100} intensity={4} color="white" />
        <Number mouse={mouse} hover={hover} />
        <Particles count={isMobile ? 5000 : 10000} mouse={mouse} />
        <Sparks count={20} mouse={mouse} colors={['#A2CCB6', '#FCEEB5', '#EE786E', '#e0feff', 'lightpink', 'lightblue']} />
        <Effects down={down} />
      </Canvas>
      <div className="frame">
        <a className="frame__title" href="https://github.com/react-spring/react-three-fiber">
          react/three/fiber
        </a>
      </div>
    </>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
