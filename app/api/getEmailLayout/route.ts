import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
    try {
        // Construct the file path
        const filePath = path.join(process.cwd(), 'public', 'layout.html');

        // Read the HTML file
        const htmlContent = await fs.readFile(filePath, 'utf8');

        // Return the HTML content as plain text
        return new NextResponse(htmlContent, {
            headers: { 'Content-Type': 'text/html' },
        });
    } catch (error) {
        // Handle errors (e.g., file not found, filesystem error)
        console.error('Error reading layout.html:', error);
        return new NextResponse('Failed to load email layout.', {
            status: 500,
        });
    }
}