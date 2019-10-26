import * as CANNON from "cannon";
import React, { useState} from "react";
import { TextureLoader } from 'three/src/loaders/TextureLoader.js'
import { useThree, useFrame, useLoader } from "react-three-fiber"
import { useDrag } from "react-use-gesture";
import * as THREE from 'three';
import "./index.css"
import { useCannon } from './useCannon';
import { get3DPosition } from './position-utils.js';

function DraggableDodecahedron({ position: initialPosition, material }) {
    const { camera, mouse } = useThree();
    const [position, setPosition] = useState(initialPosition);
    const [quaternion, setQuaternion] = useState([0, 0, 0, 0]);

    const { ref, body } = useCannon({ bodyProps: { mass: 100000 } }, body => {
        body.addShape(new CANNON.Box(new CANNON.Vec3(1, 1, 1)))
        body.position.set(...position);
    }, []);

    const bind = useDrag(({ offset: [,], xy: [x, y], first, last }) => {
        if (first) {
            body.mass = 0;
            body.updateMassProperties();
        } else if (last) {
            body.mass = 10000;
            body.updateMassProperties();
        }
        const pos = get3DPosition({ screenX: mouse.x, screenY: mouse.y, camera });
        body.position.set(pos[0], pos[1], -0.7);
    }, { pointerEvents: true });

    useFrame(() => {
        // Sync cannon body position with three js
        const deltaX = Math.abs(body.position.x - position[0]);
        const deltaY = Math.abs(body.position.y - position[1]);
        const deltaZ = Math.abs(body.position.z - position[2]);
        if (deltaX > 0.001 || deltaY > 0.001 || deltaZ > 0.001) {
            setPosition(body.position.clone().toArray());
        }
        const bodyQuaternion = body.quaternion.toArray();
        const quaternionDelta = bodyQuaternion.map((n, idx) => Math.abs(n - quaternion[idx]))
            .reduce((acc, curr) => acc + curr);
        if (quaternionDelta > 0.01) {
            setQuaternion(body.quaternion.toArray());
        }
    });


    
    return (
        <mesh ref={ref} castShadow position={position} quaternion={quaternion} {...bind()}
            onClick={e => {
                e.stopPropagation();
            }}
            material={material}
        >

            <dodecahedronBufferGeometry attach="geometry" />
           

        </mesh>
    )
}

export default DraggableDodecahedron;