import * as kle from "./kleparser";
import Decimal from "decimal.js";

export class LayoutObject {
  x: number = 0;
  y: number = 0;
  rotation_angle: number = 0;
}

export class KBSpecEncoder extends LayoutObject {
  componentType: string = "encoder";
  radius: number = 1;
}

export class KBSpecKey extends LayoutObject {
  labels: string[] = [];

  width: number = 1;
  height: number = 1;

  profile: string = "";
  switchType: string = "";
}

export class KBSpecOLED extends LayoutObject {
  componentType: string = "oled";
  oledType: string = "128x32";
}

export class KBSpecMetadata {
  switchType: string = "";
  name: string = "";
}

export class KBSpec {
  
  meta: KBSpecMetadata = new KBSpecMetadata();
  keys: KBSpecKey[] = [];
  components: LayoutObject[] = [];
}

export function createKBSpecFromKLE(layoutString: string): KBSpec{
  let kleBoard: kle.Keyboard = kle.parse(layoutString);
  let retval: KBSpec = new KBSpec();

  retval.meta.switchType = kleBoard.meta.switchMount;
  retval.meta.name = kleBoard.meta.name;

  for (let kleKey of kleBoard.keys) {

    let componentType = "key"; 

    for (let label of kleKey.labels) {
      if (!label) {
        continue
      }
      label = label.toLowerCase().trim();
      if (["oled"].includes(label)) {
        componentType = "oled";
      }
      if (["knob", "enc", "encoder"].includes(label)) {
        componentType = "encoder";
      }
    }
    
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


    switch (componentType) {
      case "key":
        let key = new KBSpecKey();
        key.labels = [...kleKey.labels];

        key.x = x.toNumber();
        key.y = y.toNumber();
        key.rotation_angle = key_orientation.toNumber();
        key.width = width.toNumber();

        key.profile = kleKey.profile;
        key.switchType = kleKey.sm;

        retval.keys.push(key);
        break;

      case "oled":
        let oled = new KBSpecOLED();

        oled.x = x.toNumber();
        oled.y = y.toNumber();
        oled.rotation_angle = key_orientation.toNumber();

        retval.components.push(oled);
        break;

      case "encoder":
        let encoder = new KBSpecEncoder();

        encoder.x = x.toNumber();
        encoder.y = y.toNumber();
        encoder.rotation_angle = key_orientation.toNumber();

        encoder.radius = Decimal.div(Decimal.add(width, height), 2).toNumber();

        retval.components.push(encoder);
        break;
    }
  }

  return retval;
}
