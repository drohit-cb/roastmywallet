import { neon } from '@neondatabase/serverless';
import { join, dirname } from 'path';
import { readdirSync } from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface MigrateOptions {
    databaseUrl: string;
}

async function getMigrationFiles() {
    const migrationsDir = join(__dirname, 'migrations');
    const files = await readdirSync(migrationsDir);
    return files
        .filter(f => f.endsWith('.ts'))
        .sort();
}

export async function migrate({ databaseUrl }: MigrateOptions) {
    console.log('Starting migrations...');
    const sql = neon(databaseUrl);

    // Check if migrations table exists
    const tableExists = await sql`
        SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_name = 'migrations'
        );
    `;

    let executedMigrations: string[] = [];

    if (!tableExists[0].exists) {
        console.log('Creating migrations table...');
        // Run the first migration directly
        const { up } = await import('./migrations/000_create_migrations');
        await up();
    } else {
        // Get list of executed migrations
        const rows = await sql`
            SELECT name FROM migrations ORDER BY id;
        `;
        executedMigrations = rows.map(r => r.name);
    }

    const migrationFiles = await getMigrationFiles();

    for (const file of migrationFiles) {
        const name = file.replace('.ts', '');
        if (!executedMigrations.includes(name)) {
            console.log(`Running migration: ${name}`);

            const { up } = await import(`./migrations/${name}`);
            await up();

            // Don't record the initial migration twice
            if (name !== '000_create_migrations') {
                await sql`
                    INSERT INTO migrations (name) 
                    VALUES (${name});
                `;
            }

            console.log(`Completed migration: ${name}`);
        }
    }

    console.log('Migrations complete!');
}