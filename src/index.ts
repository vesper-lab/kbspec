import * as kle from "@ijprest/kle-serial";

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
