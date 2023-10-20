import Head from "next/head";
import Link from "next/link";

import { api } from "~/utils/api";

import { BakeShadows, CameraControls, SoftShadows } from "@react-three/drei";
import Canvas from "~/components/Canvas";

export default function Home() {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen bg-white">
        <Canvas />
      </main>
    </>
  );
}