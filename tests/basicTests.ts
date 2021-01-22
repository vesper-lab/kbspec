import { KBSpec } from '../src/index'

test('adds 1 + 2 to equal 3', () => {
    let spec = new KBSpec();
    expect(spec.keys.length).toBe(0);
  });