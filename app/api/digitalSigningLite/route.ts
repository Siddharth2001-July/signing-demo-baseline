'use server'
import { NextRequest, NextResponse } from 'next/server';
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    formData.append('data', JSON.stringify({
      signatureType: "cades",
      flatten: true,
      cadesLevel: "b-lt",
      appearance : {
        mode: "signatureAndDescription"
      },
      formFieldName: "DigitalSignature",
      signatureMetadata:{
        signerName: "Signing Demo",
        signatureReason: "Demo digital signature using PSPDFKit",
        signatureLocation: "Planet Earth"
      },
    }));

    const apiToken = process.env.NEXT_PSPDFKIT_API_FREE;
    const response = await axios.post('https://api.pspdfkit.com/sign', formData, {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
        'Content-Type': 'multipart/form-data'
      },
      responseType: 'arraybuffer'
    });

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="signed_document.pdf"'
      }
    });
  } catch (error) {
    console.error('Error in digital signing:', error);
    return NextResponse.json({ error: 'Error in digital signing process' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const apiToken = process.env.NEXT_PSPDFKIT_API_FREE;
    const response = await axios.get('https://api.pspdfkit.com/i/certificates', {
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
    });


    return NextResponse.json({
      data : response.data
    }, {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in fetching certificates:', error);
    return NextResponse.json({ error: 'Error in fetching certificates' }, { status: 500 });
  }
}