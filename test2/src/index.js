import ReactDOM from "react-dom"
import * as CANNON from "cannon";
import React, { useState } from "react"
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
        console.log('dragging');
        if (active) {
            body.mass = 0;
            body.updateMassProperties();
        } else {
            body.mass = 10000;
            body.updateMassProperties();
        }
        body.position.set(x / aspect, -y / aspect, -0.7);
    }, { pointerEvents: true });

    useFrame(() => {
    });
    return (
        <mesh ref={ref} castShadow position={initialPosition} {...bind()}
            onClick={e => {
                e.stopPropagation();
                console.log('clicked object');
            }}
        >

            <dodecahedronBufferGeometry attach="geometry" />
            <meshLambertMaterial attach="material" color="yellow" />

        </mesh>
    )
}

function Plane({ position, onPlaneClick }) {
    const { ref } = useCannon({ bodyProps: { mass: 0 } }, body => {
        body.addShape(new CANNON.Plane())
        body.position.set(...position)
    })
    return (
        <mesh ref={ref} receiveShadow position={position}
            onClick={onPlaneClick}>
            <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
            <meshPhongMaterial attach="material" color="#272727" />
        </mesh>
    )
}

function Objects({ objects, addObject }) {
    return <React.Fragment>
        {objects}
    </React.Fragment>;
}

function App() {

    const [objects, setObjects] = useState([
        <DraggableDodecahedron position={[0, 0, 0]} key={Math.random()} />
    ]);

    const { mouse, camera } = useThree();
    const onPlaneClick = (e) => {
        var vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
        vector.unproject(camera);
        var dir = vector.sub(camera.position).normalize();
        var distance = - camera.position.z / dir.z;
        var pos = camera.position.clone().add(dir.multiplyScalar(distance));
        const position = [pos.x, pos.y, 2];
        setObjects([...objects,
        <DraggableDodecahedron position={position} key={Math.random()} />]);
    };

    return <React.Fragment>
        <ambientLight intensity={0.5} />
        <spotLight intensity={0.6} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow />
        <Provider>
            <Objects objects={objects}>
            </Objects>
            <Plane position={[0, 0, -2]} onPlaneClick={onPlaneClick} />
        </Provider>
    </React.Fragment>

};

function createCanvas() {
    return <Canvas
        onCreated={({ gl }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
        }}
    >
        <App />
    </Canvas>
}

ReactDOM.render(
    createCanvas(),
    document.getElementById("root")
)


