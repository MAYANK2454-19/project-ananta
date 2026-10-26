import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const repositoryRoot = execFileSync('git', ['rev-parse', '--show-toplevel'], {
  encoding: 'utf8',
}).trim();

function gitLines(args) {
  return execFileSync('git', ['-C', repositoryRoot, ...args], {
    encoding: 'utf8',
  })
    .split(/\r?\n/)
    .filter(Boolean);
}

const baseSha = process.env.FORMAT_BASE_SHA;
const headSha = process.env.FORMAT_HEAD_SHA;

let changedFiles;

if (baseSha && headSha && !/^0+$/.test(baseSha)) {
  changedFiles = gitLines([
    'diff',
    '--name-only',
    '--diff-filter=ACMR',
    baseSha,
    headSha,
    '--',
  ]);
} else {
  changedFiles = [
    ...gitLines(['diff', '--name-only', 'HEAD', '--']),
    ...gitLines(['ls-files', '--others', '--exclude-standard']),
  ];
}

const projectPrefix = path
  .relative(repositoryRoot, projectRoot)
  .split(path.sep)
  .join('/');

const files = [...new Set(changedFiles.map((file) => file.replaceAll('\\', '/')))]
  .filter((file) => (projectPrefix ? file.startsWith(`${projectPrefix}/`) : true))
  .map((file) => (projectPrefix ? file.slice(projectPrefix.length + 1) : file))
  .filter(
    (file) =>
      file &&
      !file.startsWith('.next/') &&
      !file.startsWith('node_modules/') &&
      !file.startsWith('supabase/.temp/'),
  )
  .map((file) => path.resolve(projectRoot, file));

if (files.length === 0) {
  console.log('No changed project files to format-check.');
  process.exit(0);
}

const prettierCli = path.join(
  projectRoot,
  'node_modules',
  'prettier',
  'bin',
  'prettier.cjs',
);

if (!existsSync(prettierCli)) {
  console.error('Prettier is not installed. Run npm ci.');
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  [prettierCli, '--check', '--ignore-unknown', ...files],
  { stdio: 'inherit' },
);

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 1);
