function _bem(prefix: string, block: string, element: string, modifier: string) {
  if (block) {
    prefix += `-${block}`;
  }
  if (element) {
    prefix += `__${element}`;
  }
  if (modifier) {
    prefix += `--${modifier}`;
  }
  return prefix;
}

export function createBem(prefix: string) {
  const b = (block: string) => _bem(prefix, block, '', '');
  const e = (element: string) => _bem(prefix, '', element, '');
  const m = (modifier: string) => _bem(prefix, '', '', modifier);
  const be = (block: string, element: string) =>
    block && element ? _bem(prefix, block, element, '') : '';
  const bm = (block: string, modifier: string) =>
    block && modifier ? _bem(prefix, block, '', modifier) : '';
  const em = (element: string, modifier: string) =>
    element && modifier ? _bem(prefix, '', element, modifier) : '';
  const bem = (block: string, element: string, modifier: string) =>
    block && element && modifier ? _bem(prefix, block, element, modifier) : '';
  const is = (name: string, state: boolean) => (state ? `is-${name}` : '');

  return {
    b,
    e,
    m,
    be,
    bm,
    em,
    is,
    bem
  };
}

export function createNamespace(namespace: string) {
  const prefix = `l-${namespace}`;
  return createBem(prefix);
}
