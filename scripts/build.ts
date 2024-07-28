import fs from 'node:fs';
import path from 'node:path';
import { checkbox } from '@inquirer/prompts';
import { spawn } from 'node:child_process';

interface PackageLib {
  entry: string;
  path: string;
  name: string;
  main: string;
}

build();

async function build() {
  const packageLib = await getLib();
  console.log('Directories with package.json:', packageLib);
  const answers = await checkbox({
    message: 'Select a package to build',
    choices: packageLib.map((item) => {
      return {
        name: item.name,
        value: item
      };
    })
  });

  const result = await buildPackage(answers);
  console.log(result);
}

// 获取所有包含 package.json 名称
function getLib() {
  const packagesDir = path.join(__dirname, '../packages');

  const directories = fs
    .readdirSync(packagesDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  const packageLib: PackageLib[] = [];
  directories.forEach((dir) => {
    const packageJsonPath = path.join(packagesDir, dir, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const { name, main } = JSON.parse(
        fs.readFileSync(packageJsonPath, {
          encoding: 'utf-8'
        })
      );
      packageLib.push({
        entry: path.join(packagesDir, dir, main),
        path: path.join(packagesDir, dir),
        name,
        main
      });
    }
  });

  return packageLib;
}

async function buildPackage(entry: PackageLib[]) {
  const es = path.join(__dirname, './vite.es.config.ts');
  const umd = path.join(__dirname, './vite.umd.config.ts');

  createBuildVite(entry, es, umd);

  buildFlow(
    entry.map((item) => ({
      es: path.join(item.path, 'vite.es.config.ts'),
      umd: path.join(item.path, 'vite.umd.config.ts')
    }))
  );
  // build package
  // spawn('vite', ['-c', pa], {
  //   stdio: 'pipe',
  // })
}

function buildFlow(build: { es: string; umd: string }[]) {
  for (const item of build) {
    buildFiles(item.es);
  }
}

function runCommand(command: string, args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')} failed with code ${code}`));
      } else {
        resolve();
      }
    });
  });
}

async function buildFiles(file: string) {
  try {
    await runCommand('tsc', ['-b']);
    await runCommand('vite', ['build', '--config', file]);
    console.log('Build completed successfully.');
  } catch (error) {
    console.error('Build failed:', error);
  }
}

// 创建 vite.es.config.ts 和 vite.cjs.config.ts
function createBuildVite(entry: PackageLib[], es: string, umd: string) {
  for (const item of entry) {
    const esConfig = fs.readFileSync(es, { encoding: 'utf-8' });
    const umdConfig = fs.readFileSync(umd, { encoding: 'utf-8' });

    const esConfigContent = esConfig.replace(/entry:\s*[^,]+,/g, `entry: './${item.main}',`);

    const umdConfigContent = umdConfig
      .replace(/entry:\s*[^,]+,/g, `entry: './${item.main}',`)
      .replace(/name:\s*[^,]+,/g, `name: '${transformName(item.name)}',`);

    fs.writeFileSync(path.join(item.path, 'vite.es.config.ts'), esConfigContent);
    fs.writeFileSync(path.join(item.path, 'vite.umd.config.ts'), umdConfigContent);
  }
}

function transformName(name: string): string {
  return name
    .replace(/^@/, '') // 去掉开头的 @
    .replace(/-([a-z])/g, (_, char) => char.toUpperCase()) // 将连字符后的字母转换为大写
    .replace(/\/([a-z])/g, (_, char) => char.toUpperCase()); // 将斜杠后的字母转换为大写
}
