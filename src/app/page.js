'use client'

import D3Chart from '@/component/sunburst';
import { useState } from 'react';

export default function Home() {
  const [data, setData] = useState(null);  // Start with null or an empty object/array

  const uploadData = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onload = (e) => {
      const content = e.target.result;
      try {
        const parsedData = JSON.parse(content);  // Parse the JSON string
        setData(parsedData);  // Set the parsed JSON object as the state
        console.log(parsedData);
      } catch (error) {
        console.error('Error parsing imported data:', error);
        alert('An error occurred while reading the data: ' + error);
      }
    };

    reader.readAsText(file);  // Read the file as text
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <input
        type="file"
        onChange={uploadData}
        style={{ display: 'none' }}
        id="fileInput"
      />
      <button onClick={() => document.getElementById('fileInput').click()}>Upload data</button>
      <div className='bg-slate-200'>
        <D3Chart data={data}/>  {/* Pass the parsed data to the D3Chart */}
        </div>
    </div>
  );
}
