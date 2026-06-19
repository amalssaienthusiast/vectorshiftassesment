import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const positionMap = {
  left: Position.Left,
  right: Position.Right,
  top: Position.Top,
  bottom: Position.Bottom,
};

export const BaseNode = ({ id, data, title, icon, fields = [], handles = [], children }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);

  const handleFieldChange = (key, value) => {
    updateNodeField(id, key, value);
  };

  return (
    <div className="base-node">
      <div className="base-node-header">
        {icon && <span className="base-node-icon">{icon}</span>}
        <span className="base-node-title">{title}</span>
      </div>
      <div className="base-node-body">
        {children || fields.map((field) => {
          const value = data[field.key] ?? field.default ?? '';
          if (field.type === 'select') {
            return (
              <label key={field.key} className="base-node-field">
                <span>{field.label}</span>
                <select
                  value={value}
                  onChange={(e) => handleFieldChange(field.key, e.target.value)}
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
            );
          }
          return (
            <label key={field.key} className="base-node-field">
              <span>{field.label}</span>
              <input
                type="text"
                value={value}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
              />
            </label>
          );
        })}
      </div>
      {handles.map((h) => (
        <Handle
          key={h.id}
          type={h.type}
          position={positionMap[h.position]}
          id={`${id}-${h.id}`}
          style={h.offset ? { top: h.offset } : undefined}
        />
      ))}
    </div>
  );
};
