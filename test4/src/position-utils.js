import { Vector3 } from 'three/src/math/Vector3'

export const get3DPosition = ({ screenX, screenY, camera }) => {
    var vector = new Vector3(screenX, screenY, 0.5);
    vector.unproject(camera);
    var dir = vector.sub(camera.position).normalize();
    var distance = - camera.position.z / dir.z;
    var pos = camera.position.clone().add(dir.multiplyScalar(distance));
    return [pos.x, pos.y, 0];
};

