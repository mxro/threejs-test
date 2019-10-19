import ReactDOM from "react-dom"
import React, { useRef, useState } from "react"
import { Canvas, useThree, useFrame } from "react-three-fiber"
import { useDrag } from "react-use-gesture"
import "./index.css"

function DraggableDodecahedron() {
    const colors = ["hotpink", "red", "blue", "green", "yellow"];
    const ref = useRef();
    const [colorIdx, setColorIdx] = useState(0);
    const [position, setPosition] = useState([0, 0, 0]);
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;
    useFrame(() => {
        ref.current.rotation.z += 0.01
        ref.current.rotation.x += 0.01
    });
    const bind = useDrag(({ offset: [x, y] }) => {
        const [,, z] = position;
        setPosition([x / aspect, -y / aspect, z]);
    }, { pointerEvents: true });

    return (
        <mesh position={position} {...bind()}
            ref={ref}
            onClick={e => {
                if (colorIdx === 4) {
                    setColorIdx(0);
                } else {
                    setColorIdx(colorIdx+1);
                }
            }}
            onPointerOver={e => console.log('hover')}
            onPointerOut={e => console.log('unhover')}>

            <dodecahedronBufferGeometry attach="geometry" />
            <meshLambertMaterial attach="material" color={colors[colorIdx]} />

        </mesh>
    )
}

ReactDOM.render(
    <Canvas>
        <spotLight intensity={1.0} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow />
        <DraggableDodecahedron />
    </Canvas>,
    document.getElementById("root")
)


