import React from 'react';
import "../styles/Menu.css"

function Menu({ labels, setLabels, idSelectedLabel, setIdSelectedLabel, idHoverLabel, setIdHoverLabel }) {

  const groups = labels.reduce((acc, curr) => {
    if (!acc[curr.name]) {
      acc[curr.name] = [];
    }
    acc[curr.name].push(curr);
    return acc;
  }, {});

  const handleDelete = (id) => {
    setLabels(labels.filter(label => label.id !== id));
    if (idSelectedLabel === id) {
      setIdSelectedLabel(null)
    }
    if (idHoverLabel === id) {
      setIdHoverLabel(null)
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
                <div className="coordinates-x" key={label.id}>
                  <li
                    style={{ backgroundColor: label.color, fontSize: "1.5em" }}
                    onMouseEnter={() => setIdHoverLabel(label.id)}
                    onMouseLeave={() => setIdHoverLabel(null)}
                    onClick={() => handleMouseClick(label.id)}
                  >
                    ({label.coordinates.startX},{label.coordinates.startY}) -
                      ({label.coordinates.endX},{label.coordinates.endY})
                  </li>
                  <button onClick={() => handleDelete(label.id)}>X</button>
                </div>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
