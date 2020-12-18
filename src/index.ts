import * as kle from "@ijprest/kle-serial";

var testInput = [["~\\n`","!\\n1","@\\n2","#\\n3","$\\n4","%\\n5","^\\n6","&\\n7","*\\n8","(\\n9",")\\n0","_\\n-","+\\n=",{"w":2},"Backspace"],[{"w":1.5},"Tab","Q","W","E","R","T","Y","U","I","O","P","{\\n[","}\\n]",{"w":1.5},"|\\n\\"],[{"w":1.75},"CapsLock","A","S","D","F","G","H","J","K","L",":\\n;","\"\\n\'",{"w":2.25},"Enter"],[{"w":2.25},"Shift","Z","X","C","V","B","N","M","<\\n,",">\\n.","?\\n/",{"w":2.75},"Shift"],[{"w":1.25},"Ctrl",{"w":1.25},"Win",{"w":1.25},"Alt",{"a":7,"w":6.25},"",{"a":4,"w":1.25},"Alt",{"w":1.25},"Win",{"w":1.25},"Menu",{"w":1.25},"Ctrl"]];

console.log("Test input:");
console.log(testInput);

var output: kle.Keyboard = kle.Serial.deserialize(testInput);

console.log("Output:");
console.log(output);

export class KBSpecKey {
  labels: string[] = [];

  x: number = 0;
  y: number = 0;
  width: number = 1;
  height: number = 1;

  rotation_x: number = 0;
  rotation_y: number = 0;
  rotation_angle: number = 0;

  profile: string = "";

  switchType: string = "";
}

export class KBSpecMetadata {
  switchType: string = "";
}

export class KBSpec {
  meta: KBSpecMetadata = new KBSpecMetadata();
  keys: KBSpecKey[] = [];
}

export function createKBSpecFromKLE(json: kle.Keyboard): KBSpec{
	//let kleBoard: kle.Keyboard = kle.Serial.parse(json);
	let kleBoard: kle.Keyboard = json;
	let retval: KBSpec = new KBSpec();

	retval.meta.switchType = kleBoard.meta.switchMount;

	for (let kleKey of kleBoard.keys) {
		let key = new KBSpecKey();
		key.labels = [...kleKey.labels]
		key.x = kleKey.x;
		key.y = kleKey.y;
		key.width = kleKey.width;
		key.rotation_x = kleKey.rotation_x;
		key.rotation_y = kleKey.rotation_y;
		key.rotation_angle = kleKey.rotation_angle;
		key.profile = kleKey.profile;
		key.profile = kleKey.profile;
		key.switchType = kleKey.sm;

		retval.keys.push(key);
	}

	return retval;
}

var newOutput: KBSpec = createKBSpecFromKLE(output);

console.log("newOutput:");
console.log(JSON.stringify(newOutput));