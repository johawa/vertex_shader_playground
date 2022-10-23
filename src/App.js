import React from "react";
import { Canvas, extend } from "@react-three/fiber";
import { useGLTF, OrbitControls, shaderMaterial } from "@react-three/drei";

import "./App.css";

const TreeShaderMaterial = shaderMaterial(
  // Uniform
  {},
  // Vertex Shader
  `  
  void main() {   
    gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
  }`,
  // Fragment Shader
  `  void main() {   
    gl_FragColor = vec4(0.194, 0.057, 0.025, 1.0);  
  }`
);

extend({ TreeShaderMaterial });



const Tree = (props) => {
  const { nodes, materials } = useGLTF("/baum.glb");

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Cube759.geometry}
        material={materials["pine_tree_trunk.001"]}
      >
        <treeShaderMaterial />
      </mesh>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube759_1.geometry}
        material={materials["tree_leaves.001"]}
      />
    </group>
  );
};

export default function App() {
  return (
    <div className="App">
      <Canvas camera={{ position: [30, 5, 2], fov: 50 }}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planeBufferGeometry args={[100, 100]} />
          <meshBasicMaterial color="limegreen" />
        </mesh>

        <Tree />

        <OrbitControls />
        <ambientLight args={[0xff0000]} intensity={0.1} />
        <directionalLight position={[0, 0, 5]} intensity={0.5} />
      </Canvas>
    </div>
  );
}
