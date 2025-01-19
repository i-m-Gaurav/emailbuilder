import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, content, imageUrl, footer } = body;

        if (!title || !content || !imageUrl || !footer) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const filePath = path.join(process.cwd(), 'public', 'layout.html');
        const htmlContent = await fs.readFile(filePath, 'utf8');

        // Replace placeholders with user inputs
        const renderedHtml = htmlContent
            .replace('{{title}}', title)
            .replace('{{imageUrl}}', imageUrl)
            .replace('{{content}}', content)
            .replace('{{footer}}', footer);

        // Set response headers for file download
        const headers = new Headers();
        headers.set('Content-Type', 'text/html');
        headers.set('Content-Disposition', 'attachment; filename=template.html');

        return new NextResponse(renderedHtml, {
            status: 200,
            headers: headers,
        });

    } catch (error) {
        console.error('Error in POST /api/template:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error },
            { status: 500 }
        );
    }
}