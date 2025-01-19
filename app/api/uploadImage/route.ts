import type { NextApiRequest, NextApiResponse } from 'next';
import { connectToDB } from '@/lib/db';
import Image from '../../../models/Image';
import { NextResponse } from 'next/server';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
    await connectToDB();

    try {
        const { imageUrl } = req.body;
        const newImage = new Image({ imageUrl });
        await newImage.save();
        res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
        NextResponse.json({ message: 'Error uploading image' , error});
    }
}

