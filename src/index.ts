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

function fixPrecisionv(val: number): number{
  return parseFloat(val.toPrecision(15))
}

export function createKBSpecFromKLE(layoutString: string): KBSpec{
  let kleBoard: kle.Keyboard = kle.Serial.parse(layoutString);
  let retval: KBSpec = new KBSpec();

  retval.meta.switchType = kleBoard.meta.switchMount;

  for (let kleKey of kleBoard.keys) {
    let key = new KBSpecKey();
    key.labels = [...kleKey.labels]
    key.x = fixPrecisionv(kleKey.x);
    key.y = fixPrecisionv(kleKey.y);
    key.width = fixPrecisionv(kleKey.width);
    key.rotation_x = fixPrecisionv(kleKey.rotation_x);
    key.rotation_y = fixPrecisionv(kleKey.rotation_y);
    key.rotation_angle = fixPrecisionv(kleKey.rotation_angle);
    key.profile = kleKey.profile;
    key.switchType = kleKey.sm;

    retval.keys.push(key);
  }

  return retval;
}
