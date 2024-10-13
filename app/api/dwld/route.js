import fs from 'fs';
import path from 'path';

import fetch from 'node-fetch';

import { NextResponse } from 'next/server';


export async function POST(request){
    const body = await request.json();
   console.log(body);
  
  if (!body) {
    console.log("No Body")
    return ;
  }

 
//     // Fetch the image
    const response = await fetch(body);
   
//console.log(response)
    // Ensure successful response
    if (!response.ok) {
        const d=await response.json();
        console.log(d)
      return NextResponse.json({error:"Error Image"})
    }

//     // Define the path to save the downloaded file within your project folder
    let fileName = path.basename(body);
    // let format=fileName.split(".")[1];
    // fileName="dummy."+format;
    const filePath = path.join(process.cwd(), 'public', 'downloads', fileName);

//     // Create a writable stream to save the image
   const fileStream = fs.createWriteStream(filePath);

    // Pipe the response stream to the file stream
    response.body.pipe(fileStream);

    // Wait for the file to finish downloading
    await new Promise((resolve, reject) => {
      fileStream.on('finish', resolve);
      fileStream.on('error', reject);
    });

//     // Send a success response
    return NextResponse.json({body});


}
