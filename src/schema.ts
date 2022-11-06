import { readFileSync } from 'fs';
import path from 'path';
import { cwd } from 'node:process';

const schemaPath = path.join(cwd(), 'src', 'schema', 'schema.graphql');
export default readFileSync(schemaPath).toString('utf-8');
