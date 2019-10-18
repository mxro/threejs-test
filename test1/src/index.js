import ReactDOM from "react-dom"
import React from "react"
import { Canvas, useThree } from "react-three-fiber"
import { useDrag } from "react-use-gesture"
import { useSpring, a } from "react-spring/three"
import "./index.css"

function Obj() {
  const { size, viewport } = useThree()
  const aspect = size.width / viewport.width
  //const [spring, set] = useSpring(() => ({ position: [0, 0, 0], config: { mass: 4, friction: 50, tension: 1500 } }))
  const set = (x, y) => {
    console.log(x);
  };
  const bind = useDrag(({ offset: [x, y] }) => set({ position: [x / aspect, -y / aspect, 0] }), { pointerEvents: true })

  return (
    <React.Fragment>
    <a.mesh {...bind()}>
      <dodecahedronBufferGeometry attach="geometry" />
      <meshNormalMaterial attach="material" />
    </a.mesh>
    <mesh receiveShadow>
      <planeBufferGeometry attach="geometry" args={[1000, 1000]} />
      <meshPhongMaterial attach="material" color="#272727" />
    </mesh>
    </React.Fragment>
  )
}

ReactDOM.render(
  <Canvas>
    <Obj />
  </Canvas>,
  document.getElementById("root")
)


