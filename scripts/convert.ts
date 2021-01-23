import * as fs from 'fs'
import * as path from 'path'
import { createKBSpecFromKLE } from '../src/index'


// if(process.argv.length != 2) {
//     throw process.argv.length.toString() + " arguments were given, expected 2.";
// } 

function convertFile(input_filename: string, output_filename: string) {
    let kle_layout = fs.readFileSync(input_filename, 'utf8');
    let kbdspec_layout = createKBSpecFromKLE(kle_layout);
    let output_string = JSON.stringify(kbdspec_layout, null, 2);
    fs.writeFileSync(output_filename, output_string);
}

let examples_directory = path.join(__dirname, '../examples');
let files = fs.readdirSync(examples_directory);
let kle_file_names = files.filter((file_name) => { return file_name.endsWith('.kle.json')});

kle_file_names.forEach((filename) => {
    let input_path = path.join(examples_directory, filename);
    let output_path = input_path.replace(".kle.json", ".kbspec.json");
    convertFile(input_path, output_path);
})
