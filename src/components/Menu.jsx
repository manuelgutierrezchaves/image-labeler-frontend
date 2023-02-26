import React from 'react';
import "../styles/Menu.css"

function Menu({ labels, setLabels }) {

  const groups = labels.reduce((acc, curr) => {
    if (!acc[curr.name]) {
      acc[curr.name] = [];
    }
    acc[curr.name].push(curr);
    return acc;
  }, {});

  const handleDelete = (id) => {
    setLabels(labels.filter(label => label.id_label !== id));
  }

  const handleMouseEnter = (id) => {
    const newLabels = [...labels];
    const label = newLabels.find(l => l.id_label === id);
    if (label) {
      label.hover = true;
      setLabels(newLabels);
    }
  };

  const handleMouseLeave = (id) => {
    const newLabels = [...labels];
    const label = newLabels.find(l => l.id_label === id);
    if (label) {
      label.hover = false;
      setLabels(newLabels);
    }
  };

  return (
    <div className="labels-menu">
      <h1>Labels</h1>
      <ul>
        {Object.keys(groups).map(name => (
          <li key={name}>
            <h2>{name}</h2>
            <ul>
              {groups[name].map(label => (
                <li
                  key={label.id_label}
                  style={{ backgroundColor: label.color }}
                  onMouseEnter={() => handleMouseEnter(label.id_label)}
                  onMouseLeave={() => handleMouseLeave(label.id_label)}
                >
                  ({label.coordinates.startX},{label.coordinates.startY}) - 
                    ({label.coordinates.endX},{label.coordinates.endY})
                  <button onClick={() => handleDelete(label.id_label)}>X</button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
