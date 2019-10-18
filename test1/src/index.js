import ReactDOM from "react-dom"
import React, { useRef, useState } from "react"
import { Canvas, useThree, useFrame } from "react-three-fiber"
import { useDrag } from "react-use-gesture"
import { useSpring, a } from "react-spring/three"
import "./index.css"

function Thing() {
    const ref = useRef()
    const [color, setColor] = useState("hotpink");

    useFrame(() => {
        ref.current.rotation.z += 0.01

        if (ref.current.rotation.x < 1.5) {
            ref.current.rotation.x += 0.01
        } else {
            ref.current.rotation.x += 0.01
        }
    })
    return (
        <mesh
            ref={ref}
            onClick={e => setColor("red")}
            onPointerOver={e => console.log('hover')}
            onPointerOut={e => console.log('unhover')}>
            
            <dodecahedronBufferGeometry attach="geometry" />
            <meshLambertMaterial attach="material" color={color} />
            
        </mesh>
    )
}

ReactDOM.render(
    <Canvas>
        <spotLight intensity={0.6} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow />
        <Thing />
    </Canvas>,
    document.getElementById("root")
)


