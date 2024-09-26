'use client'

import D3Chart from '@/component/sunburst';
import { useState } from 'react';

//Export libraries
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';

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

  const exportImage = () => {
    domtoimage.toBlob(document.getElementById("d3chart"))
    .then(function (blob) {
        var FileSaver = require('file-saver');
        FileSaver.saveAs(blob, 'fileburst.png');
    });
  }

  const exportSVG = () => {
    const node = document.getElementById("d3chart");

    domtoimage.toSvg(node)
    .then((dataUrl) => {
      // Remove the `data:image/svg+xml;charset=utf-8,` prefix
      const svgContent = dataUrl.replace(/^data:image\/svg\+xml;charset=utf-8,/, '');
      const svgBlob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      saveAs(svgBlob, 'fileburst.svg');
    })
    .catch((error) => {
      console.error('Error converting HTML to SVG:', error);
    });
  }

  return (
    <div class="grid items-center justify-items-center">
      <div>
        <input
          type="file"
          onChange={uploadData}
          style={{ display: 'none' }}
          id="fileInput"
        />
        <button onClick={() => document.getElementById('fileInput').click()}>Upload data</button>
        <button onClick={exportImage}>Download PNG image</button>
        <button onClick={exportSVG}>Download SVG image</button>
        <a href="/drive_data_collecter.exe" download="drive_data_collecter.exe">
          Click here to download data extractor
        </a>
        <di class="block">If a extracted data is larger than 50 000 kb, it will take some time to load, try taking multiple folders then</di>
      </div>
      <div className='bg-slate-900'>
        <D3Chart data={data}/>  {/* Pass the parsed data to the D3Chart */}
        </div>
    </div>
  );
}
