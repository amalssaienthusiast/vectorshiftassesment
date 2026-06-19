// Drag source — sets the node type on dataTransfer so the canvas knows what to create on drop
export const DraggableNode = ({ type, label }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType };
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    return (
      <div
        className={`draggable-node ${type}`}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
      >
          <span className="draggable-node-label">{label}</span>
      </div>
    );
  };