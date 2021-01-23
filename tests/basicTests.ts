import { KBSpec, createKBSpecFromKLE } from '../src/index'
import { loadExampleKLE } from './utils'

test('adds 1 + 2 to equal 3', () => {
    let spec = new KBSpec();
    expect(spec.keys.length).toBe(0);
  });

test('basic conversion', () => {
    let kle_layout = loadExampleKLE("ANSI_104");
    let kbdspec_layout = createKBSpecFromKLE(kle_layout);

    expect(kbdspec_layout.keys.length).toBe(104);

    console.log(kbdspec_layout.keys);
  });