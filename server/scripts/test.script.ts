import {execSync, spawn} from 'child_process';
import * as fs from 'fs';
const port = '3002';

fs.openSync('test-integration.log', 'w');

const server = spawn(
    `ts-node`,
    ['src/server.ts'],
    {
        detached: true,
        env: {
            ...process.env,
            PORT: port
        },
        stdio: ['ignore', fs.openSync('test-integration.log', 'a'), fs.openSync('test-integration.log', 'a')]
    }
);

try {
    execSync(
        `PORT=${port} npm run test:integration`,
        {
            stdio: [0, 1, 2]
        }
    );
} catch (e) {
    throw e;
} finally {
    console.log('kill');
    server.kill();
}