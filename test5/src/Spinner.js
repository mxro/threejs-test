import React, { useRef, useState, useMemo } from "react"
import { useFrame, useLoader } from "react-three-fiber";
import * as THREE from 'three';

function Spinner() {
    const ref = useRef();

    const colors = ["#5fc551", "#2dc72d", "#16da16", "#05f705", "#16da16", "#2dc72d"];

    const [colorIdx, setColorIdx] = useState(0);
    const [lastUpdated, setLastUpdated] = useState(new Date().getTime());

    useFrame(() => {
        ref.current.rotation.z += 0.03;
        ref.current.rotation.x += 0.03;

        if (lastUpdated + 300 < new Date().getTime()) {
            if (colorIdx === 5) {
                setColorIdx(0);
            } else {
                setColorIdx(colorIdx + 1);
            }
            setLastUpdated(new Date().getTime());
        }
    });
    const [font] = useLoader(THREE.FontLoader, 'fonts/Roboto_Regular.json');
    // console.log(font);
    const config = useMemo(
        () => ({ font, hAlign: "center", size: 0.2, height: 0.1, curveSegments: 32, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.02, bevelOffset: 0, bevelSegments: 8 }),
        [font]
    )

    return <React.Fragment>
        <spotLight intensity={0.8} position={[20, 20, 50]} penumbra={1} castShadow />
        <ambientLight intensity={0.5} />
        <mesh position={[0.5, 6, 0]}
            scale={[0.3, 0.3, 0.3]}
            ref={ref}
        >
            <dodecahedronBufferGeometry attach="geometry" />
            <meshLambertMaterial attach="material" color={colors[colorIdx]} />
        </mesh>
        <mesh position={[0, 4.6, 0]} >

            <textGeometry attach="geometry" args={["Loading", config]} />
            <meshNormalMaterial attach="material" />
        </mesh>
    </React.Fragment>;
}

export default Spinner;