import * as fs from 'fs'
import * as path from 'path'
import { convertFile } from './convert_single'

let examples_directory = path.join(__dirname, '../examples');
let files = fs.readdirSync(examples_directory);
let kle_file_names = files.filter((file_name) => { return file_name.endsWith('.kle.json')});

kle_file_names.forEach((filename) => {
    let input_path = path.join(examples_directory, filename);
    let output_path = input_path.replace(".kle.json", ".kbspec.json");
    convertFile(input_path, output_path);
})
