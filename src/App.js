import React, { useRef } from "react";
import glsl from "babel-plugin-glsl/macro";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, shaderMaterial } from "@react-three/drei";

import "./App.css";

const TreeShaderMaterial = shaderMaterial(
  // Uniform
  {
    uTime: 0,
  },
  // Vertex Shader
  glsl`  
  precision mediump float;

  uniform float uTime;

  #pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl); 

  void main() {  
    vec3 pos = position;
    float noiseFreq = 2.0;
    float noiseAmp = 0.4;
    vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
    pos.y += snoise3(noisePos) * noiseAmp;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);  
  }`,
  // Fragment Shader
  glsl` 
   void main() {   
    gl_FragColor = vec4(0.194, 0.057, 0.025, 1.0);  
  }`
);

extend({ TreeShaderMaterial });

const Tree = (props) => {
  const ref = useRef();
  const { nodes, materials } = useGLTF("/baum.glb");

  useFrame(({ clock }) => (ref.current.uTime = clock.getElapsedTime()));

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Cube759.geometry}
        material={materials["pine_tree_trunk.001"]}
      >
        <treeShaderMaterial ref={ref} />
      </mesh>
      {/* <mesh
        castShadow
        receiveShadow
        geometry={nodes.Cube759_1.geometry}
        material={materials["tree_leaves.001"]}
      /> */}
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
