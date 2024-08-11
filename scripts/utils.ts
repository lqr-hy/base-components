import { spawn, StdioOptions } from 'node:child_process';
import path from 'node:path';
import { confirm, input, select } from '@inquirer/prompts';
import { major, inc } from 'semver';
import { existsSync, readFileSync } from 'node:fs';
import ora from 'ora';
import chalk from 'chalk';

export type ReleaseType = 'alpha' | 'next' | 'latest';

type ReleaseTypeVersion =
  | 'major'
  | 'premajor'
  | 'minor'
  | 'preminor'
  | 'patch'
  | 'prepatch'
  | 'prerelease';

interface ReleaseTypeConfig {
  type: ReleaseTypeVersion[];
  suffix: string;
}

const releaseTypeMap: Record<ReleaseType, ReleaseTypeConfig> = {
  alpha: {
    type: ['prerelease', 'prepatch', 'preminor', 'premajor'],
    suffix: 'alpha'
  },
  next: {
    type: ['prerelease', 'prepatch', 'preminor', 'premajor'],
    suffix: 'rc'
  },
  latest: {
    type: ['patch', 'minor', 'major'],
    suffix: ''
  }
};

export const exec = <T>(
  command: string,
  args: string[],
  stdio: StdioOptions = 'pipe'
): Promise<T> => {
  return new Promise<T>((resolve, reject) => {
    const child = spawn(command, args, { stdio });

    let output = '';

    child.stdout.on('data', (data) => {
      output = data.toString().trim();
    });

    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`${command} ${args.join(' ')} failed with code ${code}`));
      } else {
        resolve(output as T);
      }
    });
  });
};

// 检查当前分支是否干净
export const checkBranchContent = async () => {
  const isClean = !(await exec('git', ['status', '--porcelain']));
  return isClean;
};

// 获取本地版本号
export const getLocalVersion = () => {
  const dir = path.resolve(process.cwd(), 'package.json');
  const packageJsonContent = readFileSync(dir, 'utf-8');
  const packageJson = JSON.parse(packageJsonContent);
  return packageJson.version;
};

// 获取远程版本号
export const getRemoteVersions = async () => {
  const dir = path.resolve(process.cwd(), 'package.json');
  const packageJsonContent = readFileSync(dir, 'utf-8');
  const packageJson = JSON.parse(packageJsonContent);
  const packageName = packageJson.name;

  try {
    const versions = await exec<string>('npm', ['view', packageName, 'versions', '--json']);
    return JSON.parse(versions);
  } catch (e) {
    return [];
  }
};

// 获取分支名
export const getBranchName = async () => {
  const name = await exec<string>('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  return name;
};

// 推送当前分支
export const pushCurrentBranch = async () => {
  const branchName = await getBranchName();

  const isCommit = await confirm({
    message: '是否提交当前分支代码？'
  });

  if (isCommit) {
    const answer = await input({
      message: '请输入提交信息',
      validate: (input) => {
        if (!input) {
          return '提交信息不能为空';
        }
        // 校验是否符合规范
        const reg = /^feat:|^fix:|^docs:|^style:|^refactor:|^perf:|^test:|^chore:|^revert:/;
        if (!reg.test(input)) {
          return '提交信息格式不正确 应符合提交规范';
        }

        return true;
      }
    });

    const msg = answer || 'feat: update';
    return await gitPush(branchName, msg);
  }

  return isCommit;
};

export const gitPush = async (branchName: string, msg: string) => {
  const currentPath = process.cwd();
  // 检测是不是当前项目根目录 应该判断 是否有.git文件夹
  if (!existsSync(path.resolve(process.cwd(), '.git'))) {
    // 去根目录
    await process.chdir(getRootPath());
  }

  try {
    const spinner = ora(chalk.green('开始提交')).start();
    await exec('git', ['add', '.']);
    await exec('git', ['commit', '-m', msg]);
    await exec('git', ['push', '-u', 'origin', branchName]);
    spinner.stop();
    ora(chalk.green('提交成功')).succeed();

    // 返回当前目录
    await process.chdir(currentPath);
    return true;
  } catch (error) {
    await process.chdir(currentPath);
    ora(chalk.red('提交失败' + error)).stop();
    return false;
  }
};

// 获取当前项目根目录
export const getRootPath = () => {
  let rootPath = process.cwd();
  // 检测是不是当前项目根目录 应该判断 是否有.git文件
  if (existsSync(path.resolve(process.cwd(), '.git'))) {
    return rootPath;
  }
  // 找到当前项目包含.git的目录 不包含 就往上级目录找
  while (!existsSync(path.resolve(rootPath, '.git'))) {
    rootPath = path.resolve(rootPath, '../');
  }
  return rootPath;
};

// 获取大版本号
export const getMajorVersion = (version) => {
  const majorVersion = major(version);
  return majorVersion;
};

// 推送tag
export const pushTag = async (version) => {
  const tag = `v${version}`;
  await exec('git', ['tag', tag]);
  await exec('git', ['push', 'origin', tag]);
};

// 获取发布版本号
export const getReleaseVersion = async (type: ReleaseType): Promise<string> => {
  const version = getLocalVersion();
  const typeConf = releaseTypeMap[type];
  const releaseTypes = typeConf.type;

  // 生成待选择的版本号
  const generateVersions = releaseTypes.map((item) => {
    return `${item}: ${inc(version, item, typeConf.suffix)}`;
  });

  const remoteVersions = await getRemoteVersions();

  // 生成版本选项
  const choices = generateVersions.map((item) => {
    const [prefix, version] = item.split(':');
    const newVersion = checkVersion(version.trim(), type, remoteVersions);
    return {
      name: `${prefix}: ${newVersion}`,
      value: newVersion
    };
  });

  const answer = await select({
    message: `请选择${type}版本号`,
    choices: choices
  });

  return answer;
};

export const checkVersion = (version, type, remoteVersions) => {
  while (remoteVersions.includes(version)) {
    version = inc(version, type === 'latest' ? 'patch' : 'prerelease');
  }
  return version;
};

// 检查远程是否有当前分支
export const checkBranchExist = async () => {
  const branchName = await getBranchName();
  const remoteBranches = await exec<string>('git', ['branch', '-r']);
  const isExist = remoteBranches.includes(`origin/${branchName}`);
  console.log(branchName, remoteBranches, isExist);
  return isExist;
};

export const updateChangeLog = async () => {
  const rootPath = getRootPath();
  await exec('conventional-changelog', ['-p', 'angular', '-i', `${rootPath}/CHANGELOG.md`, '-s']);
};
