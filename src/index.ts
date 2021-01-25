import * as kle from "./kleparser";
import Decimal from "decimal.js";

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

export function createKBSpecFromKLE(layoutString: string): KBSpec{
  let kleBoard: kle.Keyboard = kle.parse(layoutString);
  let retval: KBSpec = new KBSpec();

  retval.meta.switchType = kleBoard.meta.switchMount;

  for (let kleKey of kleBoard.keys) {
    let key = new KBSpecKey();
    key.labels = [...kleKey.labels];
    
    let rotation_x = new Decimal(kleKey.rotation_x);
    let rotation_y = new Decimal(-kleKey.rotation_y);
    let x_start = new Decimal(kleKey.x);
    let y_start = new Decimal(-kleKey.y);
    let rotation_angle = new Decimal(-kleKey.rotation_angle);

    let width = new Decimal(kleKey.width);
    let height = new Decimal(kleKey.height);

    x_start = x_start.plus(width.dividedBy(2));
    y_start = y_start.minus(height.dividedBy(2));

    let angle_offset = 0;
    if(height > width) {
      let temp = height;
      height = width;
      width = temp;
      angle_offset = 90;
    }

    let x_diff = x_start.minus(rotation_x);
    let y_diff = y_start.minus(rotation_y);

    let rad_rotation_angle = rotation_angle.dividedBy(180).times(Math.PI);

    let angle_sin = rad_rotation_angle.sin();
    let angle_cos = rad_rotation_angle.cos();
    let x_offset = Decimal.sub(x_diff.times(angle_cos), y_diff.times(angle_sin));
    let y_offset = Decimal.add(x_diff.times(angle_sin), y_diff.times(angle_cos));
    let x = Decimal.add(rotation_x, x_offset);
    let y =  Decimal.add(rotation_y, y_offset);

    let key_orientation = Decimal.add(rotation_angle, angle_offset);

    key.x = x.toNumber();
    key.y = y.toNumber();
    key.rotation_angle = key_orientation.toNumber();
    key.width = width.toNumber();

    key.profile = kleKey.profile;
    key.switchType = kleKey.sm;

    retval.keys.push(key);
  }

  return retval;
}
