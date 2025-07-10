import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import { useGLTF, Bounds } from "@react-three/drei";
import * as THREE from "three";

/* ── Avatar model component ─────────────────────────────────────────────── */
function AvatarModel({ talking }: { talking: boolean }) {
  const { scene, nodes } = useGLTF("/avatar.glb") as unknown as {
    scene: THREE.Group;
    nodes: Record<string, THREE.Mesh>;
  };

  /* locate mesh with morph-targets */
  const mesh =
    nodes.Wolf3D_Head ??
    Object.values(nodes).find((m) => (m as THREE.Mesh).morphTargetDictionary) ??
    null;

  /* choose best mouth morph-target */
  let idx = -1;
  if (mesh && mesh.morphTargetDictionary) {
    const dict = mesh.morphTargetDictionary as Record<string, number>;
    const preferred = [
      "viseme_aa",
      "mouthOpen",
      "jawOpen",
      ...Object.keys(dict).filter((k) => k.startsWith("viseme_")),
    ].find((k) => k in dict);
    idx = preferred ? dict[preferred] : Object.values(dict)[0];
  }

  const phase = useRef(0);
  useFrame((_, dt) => {
    if (!mesh || idx === -1) return;
    if (talking) {
      phase.current += dt * 6; // speed
      mesh.morphTargetInfluences![idx] =
        ((Math.sin(phase.current) + 1) / 2) * 0.9;
    } else {
      mesh.morphTargetInfluences![idx] *= 0.8;
    }
  });

  return <primitive object={scene} dispose={null} />;
}

/* ── Canvas wrapper ─────────────────────────────────────────────────────── */
export default function AvatarCanvas({ audioUrl }: { audioUrl: string }) {
  const [talking, setTalking] = useState(false);

  /* play TTS and toggle mouth-flap flag */
  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);
    audio
      .play()
      .then(() => setTalking(true))
      .catch(console.warn);
    audio.onended = () => setTalking(false);
    return () => {
      audio.pause();
      audio.src = "";
    };
  }, [audioUrl]);

  return (
    <div style={{ width: 600, height: 450 }}>
      <Canvas shadows camera={{ fov: 25 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 5, 5]} intensity={0.4} />

        <Suspense fallback={null}>
          {/* Auto-frame avatar so the head is always visible */}
          <Bounds fit clip observe margin={1}>
            <AvatarModel talking={talking} />
          </Bounds>
        </Suspense>
      </Canvas>
    </div>
  );
}

/* cache the GLB */
useGLTF.preload("/avatar.glb");
