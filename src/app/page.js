'use client'

import Image from "next/image";
import D3Chart from "@/component/sunburst";
import { useState } from "react";

export default function Home() {
  const [data, setData] = useState({data1: 10, data2: 20, data3: 30, data4: 40, data5: 50})

  const uploadData = (event) => {
    console.log("Hello World")
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const content = e.target.result;
      try{
        setData(content)
        console.log(content)
      } catch (error) {
        console.error('Error parsing imported data:', error);
        alert('An error occurred while reading the data: ' + error);
      }
    };

    reader.readAsText(file);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <input
        type="file"
        onChange={uploadData}
        style={{ display: 'none' }}
        id="fileInput"
      />
      <button onClick={() => document.getElementById('fileInput').click()}>Upload data</button>
      <D3Chart data={data} />
    </div>
  );
}
