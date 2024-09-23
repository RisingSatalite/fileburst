'use client'

import Image from "next/image";
import D3Chart from "@/component/sunburst";
import { useState } from "react";

export default function Home() {
  const {data, setData} = useState([10, 20, 30, 40, 50])
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <input/>
      <D3Chart data={data} />
    </div>
  );
}
