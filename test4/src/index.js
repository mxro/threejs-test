import ReactDOM from "react-dom"
import * as CANNON from "cannon";
import React, { useState, Suspense } from "react";
import { TextureLoader } from 'three/src/loaders/TextureLoader.js'
import { Canvas, useThree, useFrame, useLoader } from "react-three-fiber"
import * as THREE from 'three';
import "./index.css"
import { useCannon, Provider } from './useCannon';
import useEventListener from '@use-it/event-listener';
import DraggableDodecahedron from './DraggableDodecahedron.js';
import { get3DPosition } from './position-utils.js';

function Plane({ position, onPlaneClick, onCameraMoved }) {
    const { ref } = useCannon({ bodyProps: { mass: 0 } }, body => {
        body.addShape(new CANNON.Plane())
        body.position.set(...position)
    });

    const [texture] = useLoader(TextureLoader, 'textures/grasslight-big.jpg');

    if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1500, 1500);
        texture.anisotropy = 16;
    }

    return (
        <mesh ref={ref} receiveShadow position={position}
            onClick={onPlaneClick}>
            <planeBufferGeometry attach="geometry" args={[10000, 10000]} />
            {texture && 
                <meshPhongMaterial attach="material" map={texture} />
            }

            {/* <meshPhongMaterial attach="material" color={"#272727"} /> */}
        </mesh>
    )
}

function Objects({ objects, addObject }) {
    return <React.Fragment>
        {objects}
    </React.Fragment>;
}


const keyPressed = {
};

function App() {

    const [objects, setObjects] = useState([]);

    const { mouse, camera } = useThree();


    const [lightPosition, setLightPosition] = useState([0, -300, 500]);
    const [lightQuaternion, setLightQuaternion] = useState([0, 0, 0, 0]);
    const onCameraMoved = (delta) => {
        const newLightPosition = delta.map((e, idx) => lightPosition[idx] + e);
        setLightPosition(newLightPosition);
        setLightQuaternion([newLightPosition[0]+300, newLightPosition[1]-500, 0, 0]);
    };

    const onPlaneClick = (e) => {
        const position = get3DPosition({ screenX: mouse.x, screenY: mouse.y, camera });
        setObjects([...objects,
        <DraggableDodecahedron position={position} key={Math.random()} />]);
    };

    const handleKeyDown = (e) => {
        if (!keyPressed[e.key]) {
            keyPressed[e.key] = new Date().getTime();
        }
    };

    const handleKeyUp = (e) => {
        delete keyPressed[e.key];
    };

    const mouseWheel = (e) => {
        let delta = e.wheelDelta;
        delta = delta / 240;
        delta = -delta;
        if (delta <= 0) {
            delta -= camera.position.z * 0.1;
        } else {
            delta += camera.position.z * 0.1;
        }
        if (camera.position.z + delta > 1 && camera.position.z + delta < 200) {
            camera.translateZ(delta);
        }
        // onCameraMoved([0,0,delta]);
    };
    useEventListener('keydown', handleKeyDown);
    useEventListener('keyup', handleKeyUp);
    useEventListener('wheel', mouseWheel);
    useFrame((_, delta) => {
        // move camera according to key pressed
        Object.entries(keyPressed).forEach((e) => {
            const [key, start] = e;
            const duration = new Date().getTime() - start;

            // increase momentum if key pressed longer
            let momentum = Math.sqrt(duration + 200) * 0.01 + 0.05;

            // adjust for actual time passed
            momentum = momentum * delta / 0.016;

            // increase momentum if camera higher
            momentum = momentum + camera.position.z * 0.02;

            switch (key) {
                case 'w':
                    camera.position.set(camera.position.x, camera.position.y + momentum, camera.position.z);
                    onCameraMoved([0, momentum, 0]);
                    break;
                case 's':
                    camera.position.set(camera.position.x, camera.position.y - momentum, camera.position.z);
                    onCameraMoved([0, -momentum, 0]);
                    break;
                case 'd':
                    camera.position.set(camera.position.x + momentum, camera.position.y, camera.position.z);
                    onCameraMoved([momentum, 0, 0]);
                    break;
                case 'a':
                    camera.position.set(camera.position.x - momentum, camera.position.y, camera.position.z);
                    onCameraMoved([-momentum, 0, 0]);
                    break;
                default:
            }
        });
    });



    return <React.Fragment >
        <ambientLight intensity={0.2} />
        {/* <spotLight intensity={0.6} position={lightPosition} angle={Math.PI / 3} penumbra={1} /> */}

        <spotLight intensity={0.9} position={lightPosition} quaternion={lightQuaternion} angle={Math.PI / 3} penumbra={1} />
        <Provider>
            <Suspense fallback={(e) => { alert('Cannot load: ' + e.message); }}>
                <Objects objects={objects}>
                </Objects>
                <Plane position={[0, 0, -2]} onPlaneClick={onPlaneClick} />
            </Suspense>

        </Provider>
    </React.Fragment>

};

function createCanvas() {
    return <Canvas
        camera={{ position: [0, -2, -5] }}
        onCreated={({ gl, camera }) => {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
            camera.lookAt([0,0,0]);
        }}
    >
        <App />
    </Canvas >
}

ReactDOM.render(
    createCanvas(),
    document.getElementById("root")
)


