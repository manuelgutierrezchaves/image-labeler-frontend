import React from 'react';
import "../styles/Menu.css"

function Menu({ labels, setLabels, idSelectedLabel, setIdSelectedLabel, setIdHoverLabel }) {

  const groups = labels.reduce((acc, curr) => {
    if (!acc[curr.name]) {
      acc[curr.name] = [];
    }
    acc[curr.name].push(curr);
    return acc;
  }, {});

  const handleDelete = (id) => {
    setLabels(labels.filter(label => label.id !== id));
    if (id === idSelectedLabel) {
      setIdSelectedLabel(null)
    }
  }

  const handleMouseClick = (id) => {
    if (idSelectedLabel === id) {
      setIdSelectedLabel(null)
    } else {
      setIdSelectedLabel(id)
    }
  }

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
                  key={label.id}
                  style={{ backgroundColor: label.color }}
                  onMouseEnter={() => setIdHoverLabel(label.id)}
                  onMouseLeave={() => setIdHoverLabel(null)}
                  onClick={() => handleMouseClick(label.id)}
                >
                  ({label.coordinates.startX},{label.coordinates.startY}) - 
                    ({label.coordinates.endX},{label.coordinates.endY})
                  <button onClick={() => handleDelete(label.id)}>X</button>
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
