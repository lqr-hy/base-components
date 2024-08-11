import { select } from '@inquirer/prompts';
import ora from 'ora';
import chalk from 'chalk';

import {
  checkBranchContent,
  exec,
  getBranchName,
  getLocalVersion,
  getMajorVersion,
  getReleaseVersion,
  pushCurrentBranch,
  pushTag,
  checkBranchExist,
  gitPush,
  updateChangeLog,
  ReleaseType
} from './utils';

async function publish() {
  const branchName = await getBranchName();

  const choices: { name: string; value: ReleaseType }[] = [];
  if (branchName !== 'master') {
    choices.push({ name: 'alpha', value: 'alpha' });

    if (branchName === 'dev') {
      choices.push({ name: 'next', value: 'next' });
    }
  } else {
    choices.push({ name: 'latest', value: 'latest' });
  }

  // 1. 选择发布的版本类型
  const releaseType = await select({
    message: '请选择发布的版本类型',
    choices: choices
  });

  // 2. 开始发布
  ora(chalk.red('begin publishing ' + releaseType)).succeed();
  try {
    await release(releaseType);
  } catch (e) {
    ora(chalk.red('publish failed')).fail();
  } finally {
    ora(chalk.green('end publishing ' + releaseType)).succeed();
  }
}

async function release(type: ReleaseType) {
  // 检测当前分支内容
  const isClean = await checkBranchContent();

  // 校验远程是否有当前分支
  const isFirstPush = await checkBranchExist();

  // 如果当前分支有未提交的内容，直接返回
  if (!isClean && !isFirstPush) {
    ora(chalk.red('当前分支有未提交的内容，请先提交')).info();
    // 询问是否需要帮忙提交
    const isPush = await pushCurrentBranch();
    console.log(isPush, 'isPush');
    // 如果不需要提交，直接返回
    if (!isPush) return;
  }

  let commitResult = true;

  // 如果远程有当前分支，询问是否需要提交
  if (!isClean) {
    commitResult = await pushCurrentBranch();
  }

  if (type === 'latest' && commitResult) {
    // 如果发布latest，需要先拉取最新代码
    await exec('git', ['rebase', 'origin', 'master']);
  }

  // 获取即将要发布的版本号：生成推荐发布版本号(这个版本号已经是校验过的，不会与已存在版本重合)
  const releaseVersion = await getReleaseVersion(type);

  // 获取当前的版本号
  const currentVersion = await getLocalVersion();

  // 更改package.json 版本号
  await exec('npm', ['version', '--no-git-tag-version', releaseVersion]);
  ora(chalk.green('版本号修改成功')).succeed();
  const spinner = ora(`开始构建`).start();
  await exec('npm', ['run', 'build']);
  spinner.stop();
  ora(chalk.green('构建成功')).succeed();

  // 执行发布
  try {
    const major = getMajorVersion(releaseVersion);
    console.log(major, 'major');
    // 发布到npm
    // await exec('npm', ['publish', '--tag', `${type}${type !== 'latest' ? major : ''}`]);
    if (type === 'latest') {
      await updateChangeLog();
      ora(chalk.green('changelog 生成成功')).succeed();
    }
    // 检测当前分支内容
    const isClean = await checkBranchContent();
    const branchName = await getBranchName();
    console.log(isClean, branchName);
    if (!isClean) {
      const msg = `build: ${releaseVersion}`;
      // 提交 build: version 到当前分支
      await gitPush(branchName, msg);
    }
    // 推送tag
    await pushTag(releaseVersion);
  } catch (e) {
    // 回退package.json版本
    await exec('npm', ['version', '--no-git-tag-version', currentVersion]);
    throw new Error(e);
  }
}

publish();
