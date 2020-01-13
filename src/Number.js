import * as THREE from 'three'
import React, { Suspense, useRef, useMemo } from 'react'
import { useFrame, useThree } from 'react-three-fiber'
import lerp from 'lerp'
import Text from './Text'

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

export default function Number({ mouse, hover }) {
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
