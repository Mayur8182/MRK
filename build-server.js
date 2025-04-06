import { build } from 'esbuild';

try {
  await build({
    entryPoints: ['server/index.ts'],
    platform: 'node',
    packages: 'external',
    bundle: true,
    format: 'esm',
    outdir: 'dist',
  });
  console.log('Server build completed successfully');
} catch (error) {
  console.error('Server build failed:', error);
  process.exit(1);
}
