import { describe, expect, it } from 'vitest';
import { createBem } from '.';

describe('createBem', () => {
  const bem = createBem('test');

  it('should generate block class', () => {
    expect(bem.b('block')).toBe('test-block');
  });

  it('should generate element class', () => {
    expect(bem.e('element')).toBe('test__element');
  });

  it('should generate modifier class', () => {
    expect(bem.m('modifier')).toBe('test--modifier');
  });

  it('should generate block element class', () => {
    expect(bem.be('block', 'element')).toBe('test-block__element');
  });

  it('should generate block modifier class', () => {
    expect(bem.bm('block', 'modifier')).toBe('test-block--modifier');
  });

  it('should generate element modifier class', () => {
    expect(bem.em('element', 'modifier')).toBe('test__element--modifier');
  });

  it('should generate block element modifier class', () => {
    expect(bem.bem('block', 'element', 'modifier')).toBe('test-block__element--modifier');
  });

  it('should generate state class when state is true', () => {
    expect(bem.is('active', true)).toBe('is-active');
  });

  it('should not generate state class when state is false', () => {
    expect(bem.is('active', false)).toBe('');
  });
});
