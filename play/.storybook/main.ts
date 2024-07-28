import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-onboarding',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions'
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {}
  },
  managerHead: (head) => `
    ${head}
    <base href="/elements/" />
  `,
  viteFinal: (config) => {
    config.base = '/elements/'; // 设置 Vite 的基本路径
    return config;
  }
};
export default config;
