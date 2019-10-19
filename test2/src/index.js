import ReactDOM from "react-dom"
import * as CANNON from "cannon";
import React, { useRef, useState } from "react"
import { Canvas, useThree, useFrame } from "react-three-fiber"
import { useDrag } from "react-use-gesture";
import * as THREE from 'three';
import "./index.css"
import { useCannon, Provider } from './useCannon';

function DraggableDodecahedron({ position: initialPosition }) {
    const { size, viewport } = useThree();
    const aspect = size.width / viewport.width;

    const { ref, body } = useCannon({ bodyProps: { mass: 100000 } }, body => {
        body.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)))
        body.position.set(...initialPosition)
    });

    const bind = useDrag(({ offset: [x, y], active }) => {
        if (active) {
            body.mass = 0;
            body.updateMassProperties();
        } else {
            body.mass = 10000;
            body.updateMassProperties();
        }
        const [, , z] = body.position.toArray();
        body.position.set(x / aspect, -y / aspect, -0.7);
    }, { pointerEvents: true });

    useFrame(() => {
    });
    return (
        <mesh ref={ref} castShadow position={initialPosition} {...bind()}
            onClick={e => {
            }}
           > 

            <dodecahedronBufferGeometry attach="geometry" />
            <meshLambertMaterial attach="material" color="yellow" />

        </mesh>
    )
}

function Plane({ position }) {
    const ref = useCannon({ bodyProps: { mass: 0 } }, body => {
        body.addShape(new CANNON.Plane())
        body.position.set(...position)
    })
    return (
        <mesh ref={ref} receiveShadow position={position}>
            <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
            <meshPhongMaterial attach="material" color="#272727" />
        </mesh>
    )
}

ReactDOM.render(
    <Canvas
        onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
    >
        <ambientLight intensity={0.5} />
        <spotLight intensity={0.6} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow />
        <Provider>
            <DraggableDodecahedron position={[0, 0, 0]} />
            <Plane position={[0, 0, -2]} />
        </Provider>
    </Canvas>,
    document.getElementById("root")
)


