import { createKBSpecFromKLE } from '../src/index'
import * as fs from 'fs'
import * as path from 'path'

test('all examples have kle and kbspec files', () => {
    let examples_directory = path.join(__dirname, '../examples');
    let files = fs.readdirSync(examples_directory);

    let kle_file_names = files.filter((file_name) => { return file_name.endsWith('.kle.json')});
    let kbspec_file_names = files.filter((file_name) => { return file_name.endsWith('.kbspec.json')});
    
    expect(kle_file_names.length).toBeGreaterThan(0);
    expect(kbspec_file_names.length).toBeGreaterThan(0);
    expect(kle_file_names.length).toBe(kbspec_file_names.length);

    let kle_layout_names = kle_file_names.map((file_name) => { return file_name.replace('.kle.json', '')});
    let kbspec_layout_names = kbspec_file_names.map((file_name) => { return file_name.replace('.kbspec.json', '')});

    expect(kle_layout_names.sort()).toEqual(kbspec_layout_names.sort());
  });