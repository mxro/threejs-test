import * as THREE from 'three';
import * as CANNON from "cannon";
import { TextureLoader } from 'three/src/loaders/TextureLoader.js'
import React  from "react";
import { useCannon } from './useCannon';
import { useLoader } from "react-three-fiber"

function Plane({ position, onPlaneClick }) {
    const { ref } = useCannon({ bodyProps: { mass: 0 } }, body => {
        body.addShape(new CANNON.Plane())
        body.position.set(...position)
    });

    const [texture] = useLoader(TextureLoader, 'textures/grass/noisy-texture-64x64-o3-d10-c-59ad55-t0.png');

    if (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(4500, 4500);
        texture.anisotropy = 1;
    }

    console.log(texture);
    return (
        <mesh ref={ref} receiveShadow position={position}
            onClick={onPlaneClick}>
            <planeBufferGeometry attach="geometry" args={[10000, 10000]} />
            {texture &&
                <meshPhongMaterial attach="material" map={texture}  />
            }

        </mesh>
    )
}

export default Plane;