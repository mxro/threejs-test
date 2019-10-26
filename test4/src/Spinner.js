import React, { useRef, useState } from "react"
import { useFrame } from "react-three-fiber"
function Spinner() {
    const ref = useRef();

    const colors = ["hotpink", "red", "blue", "green", "yellow"];

    const [colorIdx, setColorIdx] = useState(0);
    const [position] = useState([0, 6, -2]);
    const [lastUpdated, setLastUpdated] = useState(new Date().getTime());

    useFrame(() => {
        ref.current.rotation.z += 0.01;
        ref.current.rotation.x += 0.01;

        if (lastUpdated + 1000 < new Date().getTime()) {
            if (colorIdx === 4) {
                setColorIdx(0);
            } else {
                setColorIdx(colorIdx + 1);
            }
            setLastUpdated(new Date().getTime());
        }
    });

    return <React.Fragment>
        <spotLight intensity={2.2} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow />
        <mesh position={position}
            ref={ref}
        >
            <dodecahedronBufferGeometry attach="geometry" />
            <meshLambertMaterial attach="material" color={colors[colorIdx]} />

        </mesh>
    </React.Fragment>;
}

export default Spinner;