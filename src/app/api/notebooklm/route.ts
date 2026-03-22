import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

function runPythonScript(scriptPath: string, args: string[]): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', [scriptPath, ...args]);
        let stdout = '';
        let stderr = '';

        pythonProcess.stdout.on('data', (data) => {
            stdout += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            stderr += data.toString();
        });

        pythonProcess.on('close', (code) => {
            resolve({ stdout, stderr });
        });

        pythonProcess.on('error', (err) => {
            reject(err);
        });
    });
}

export async function GET() {
    try {
        const scriptPath = path.join(process.cwd(), 'scripts', 'notebooklm_list.py');
        const { stdout, stderr } = await runPythonScript(scriptPath, []);

        if (stderr && !stdout) {
            return NextResponse.json({ error: stderr }, { status: 500 });
        }

        try {
            const data = JSON.parse(stdout);
            return NextResponse.json(data);
        } catch (parseError) {
            return NextResponse.json({ error: 'Failed to parse script output', raw: stdout }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { notebook_id, query, conversation_id } = await req.json();

        if (!notebook_id || !query) {
            return NextResponse.json({ error: 'notebook_id and query are required' }, { status: 400 });
        }

        const scriptPath = path.join(process.cwd(), 'scripts', 'notebooklm_query.py');
        const args = [notebook_id, query];
        if (conversation_id) args.push(conversation_id);

        const { stdout, stderr } = await runPythonScript(scriptPath, args);

        if (stderr && !stdout) {
            return NextResponse.json({ error: stderr }, { status: 500 });
        }

        try {
            const data = JSON.parse(stdout);
            return NextResponse.json(data);
        } catch (parseError) {
            return NextResponse.json({ error: 'Failed to parse script output', raw: stdout }, { status: 500 });
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
