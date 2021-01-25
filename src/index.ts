import * as kle from "./kleparser";

export class KBSpecKey {
  labels: string[] = [];

  width: number = 1;
  height: number = 1;

  x: number = 0;
  y: number = 0;
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

function fixPrecision(val: number): number{
  return parseFloat(val.toPrecision(15))
}

export function createKBSpecFromKLE(layoutString: string): KBSpec{
  let kleBoard: kle.Keyboard = kle.parse(layoutString);
  let retval: KBSpec = new KBSpec();

  retval.meta.switchType = kleBoard.meta.switchMount;

  for (let kleKey of kleBoard.keys) {
    let key = new KBSpecKey();
    key.labels = [...kleKey.labels];
    
    let rotation_x = fixPrecision(kleKey.rotation_x);
    let rotation_y = fixPrecision(-kleKey.rotation_y);
    let x_start = fixPrecision(kleKey.x);
    let y_start = fixPrecision(-kleKey.y);
    let rotation_angle = fixPrecision(-kleKey.rotation_angle);

    let width = fixPrecision(kleKey.width);
    let height = fixPrecision(kleKey.height);

    x_start += width / 2;
    y_start -= height / 2;

    let angle_offset = 0;
    if(height > width) {
      let temp = height;
      height = width;
      width = temp;
      angle_offset = 90;
    }

    let x_diff = x_start - rotation_x;
    let y_diff = y_start - rotation_y;

    let rad_rotation_angle = (rotation_angle) / 180 *  Math.PI;

    let x_offset = x_diff * Math.cos(rad_rotation_angle) - y_diff * Math.sin(rad_rotation_angle);
    let y_offset = x_diff * Math.sin(rad_rotation_angle) + y_diff * Math.cos(rad_rotation_angle);
    let x = rotation_x + x_offset;
    let y = rotation_y + y_offset;

    key.x = fixPrecision(x);
    key.y = fixPrecision(y);
    key.rotation_angle = rotation_angle + angle_offset;
    key.width = width;

    key.profile = kleKey.profile;
    key.switchType = kleKey.sm;

    retval.keys.push(key);
  }

  return retval;
}
