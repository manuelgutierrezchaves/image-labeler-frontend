import { v4 as uuidv4 } from 'uuid';

class LabelModel {
  constructor(name, color, coordinates, hover) {
    this.id = uuidv4();
    this.name = name;
    this.color = color;
    this.coordinates = coordinates;
    this.hover = hover;
  }

  updateName(name) {
    this.name = name;
  }

  updateColor(color) {
    this.color = color;
  }

  updateHover(hover) {
    this.hover = hover;
  }

  static fromJson(json) {
    return new LabelModel(
      json.id,
      json.name,
      json.color,
      json.coordinates,
      json.hover
    );
  }

  static toJson(label) {
    return JSON.stringify({
      id: label.id,
      name: label.name,
      color: label.color,
      coordinates: label.coordinates,
      hover: label.hover
    });
  }
}

export default LabelModel