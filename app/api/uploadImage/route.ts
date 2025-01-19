import { connectToDB } from '@/lib/db';
import Image from '../../../models/Image';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    await connectToDB();

    const body = await req.json();

    try {
        const { imageUrl } = body;
        const newImage = new Image({ imageUrl });
        await newImage.save();
        NextResponse.json({ message: 'Image uploaded successfully' });
    } catch (error) {
        NextResponse.json({ message: 'Error uploading image' , error});
    }
}

