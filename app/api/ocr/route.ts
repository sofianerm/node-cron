import { NextRequest, NextResponse } from 'next/server';

// Note: Cette implémentation utilise un OCR simulé pour la démo
// Pour la production, intégrez Google Cloud Vision API

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const columnsStr = formData.get('columns') as string;
    const columns = JSON.parse(columnsStr);

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Pour la démo, simuler des quantités détectées
    // Dans la vraie version, vous utiliseriez Google Cloud Vision API
    const quantities = generateMockQuantities(columns);

    return NextResponse.json({
      success: true,
      quantities,
    });
  } catch (error) {
    console.error('OCR Error:', error);
    return NextResponse.json(
      { error: 'OCR processing failed' },
      { status: 500 }
    );
  }
}

// Fonction de simulation pour la démo
function generateMockQuantities(columns: any[]) {
  // Trouver la colonne "quantity"
  const quantityColumn = columns.find((col) => col.name === 'quantity');

  if (!quantityColumn) {
    return [];
  }

  // Générer quelques quantités de test
  const mockQuantities = [
    { value: 5, bbox: { x: quantityColumn.x, y: 100, width: 50, height: 20 } },
    { value: 10, bbox: { x: quantityColumn.x, y: 150, width: 50, height: 20 } },
    { value: 3, bbox: { x: quantityColumn.x, y: 200, width: 50, height: 20 } },
    { value: 7, bbox: { x: quantityColumn.x, y: 250, width: 50, height: 20 } },
    { value: 2, bbox: { x: quantityColumn.x, y: 300, width: 50, height: 20 } },
  ];

  return mockQuantities;
}

/*
Pour intégrer Google Cloud Vision API, utilisez ce code:

import vision from '@google-cloud/vision';

const client = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

async function performOCR(fileBuffer: Buffer) {
  const [result] = await client.textDetection(fileBuffer);
  const detections = result.textAnnotations || [];
  return detections;
}

Puis filtrez les résultats selon les positions des colonnes définies.
*/
