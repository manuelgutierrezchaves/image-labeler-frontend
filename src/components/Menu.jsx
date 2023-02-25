import React from 'react';

function Menu({ items }) {
  // Agrupamos las frutas por nombre
  const groups = items.reduce((acc, curr) => {
    if (!acc[curr.name]) {
      acc[curr.name] = [];
    }
    acc[curr.name].push(curr);
    return acc;
  }, {});

  return (
    <div>
      <h1>Labels</h1>
      <ul>
        {Object.keys(groups).map(name => (
          <li key={name}>
            <h2>{name}</h2>
            <ul>
              {groups[name].map(fruit => (
                <li key={fruit.id_label} style={{ backgroundColor: fruit.color }}>
                  ({fruit.coordinates.startX},{fruit.coordinates.startY}) - ({fruit.coordinates.endX},{fruit.coordinates.endY})
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
