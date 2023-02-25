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

  return (
    <div className="labels-menu">
      <h1>Labels</h1>
      <ul>
        {Object.keys(groups).map(name => (
          <li key={name}>
            <h2>{name}</h2>
            <ul>
              {groups[name].map(fruit => (
                <li key={fruit.id_label} style={{ backgroundColor: fruit.color }}>
                  ({fruit.coordinates.startX},{fruit.coordinates.startY}) - ({fruit.coordinates.endX},{fruit.coordinates.endY})
                  <button onClick={() => handleDelete(fruit.id_label)}>X</button>
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
