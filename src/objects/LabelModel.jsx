import { v4 as uuidv4 } from 'uuid';

class LabelModel {
  constructor(name, color, coordinates) {
    this.id = uuidv4();
    this.name = name;
    this.color = color;
    this.coordinates = coordinates;
  }

  updateName(name) {
    this.name = name;
  }

  updateColor(color) {
    this.color = color;
  }

  static fromJson(json) {
    return new LabelModel(
      json.name,
      json.color,
      json.coordinates
    );
  }

  static toJson(label) {
    return JSON.stringify({
      id: label.id,
      name: label.name,
      color: label.color,
      coordinates: label.coordinates
    });
  }
}

export default LabelModel