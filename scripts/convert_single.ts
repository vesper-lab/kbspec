import * as fs from 'fs'
import { createKBSpecFromKLE } from '../src/index'

export function convertFile(input_filename: string, output_filename: string) {
    let kle_layout = fs.readFileSync(input_filename, 'utf8');
    let kbdspec_layout = createKBSpecFromKLE(kle_layout);
    let output_string = JSON.stringify(kbdspec_layout, null, 2);
    fs.writeFileSync(output_filename, output_string);
}

if (require.main === module) {

    if(process.argv.length != 3) {
        throw (process.argv.length - 2).toString() + " arguments were given, expected 1.";
    } 

    let input_path = process.argv[2];
    let output_path = input_path.replace(".json", "_kbspec.json");
    convertFile(input_path, output_path);
}