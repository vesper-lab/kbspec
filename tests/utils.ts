import * as fs from 'fs'
import * as path from 'path'

export function loadExampleKLE(example_name: string) {
  let example_path = path.join(__dirname, '..', 'examples', example_name + '.kle.json');
  let data = fs.readFileSync(example_path, 'utf8');
  return data;
}