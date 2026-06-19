import { useEffect, useRef, useMemo } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';

const VAR_REGEX = /\{\{\s*(\w+)\s*\}\}/g;
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;
const MIN_HEIGHT = 80;

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();
  const textareaRef = useRef(null);
  const text = data.text ?? '{{input}}';

  const variables = useMemo(() => {
    const matches = [];
    let match;
    while ((match = VAR_REGEX.exec(text)) !== null) {
      if (!matches.includes(match[1])) {
        matches.push(match[1]);
      }
    }
    return matches;
  }, [text]);

  useEffect(() => {
    updateNodeInternals(id);
  }, [variables.length, id, updateNodeInternals]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';
    const measuredWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, el.scrollWidth + 20));
    const parent = el.closest('.base-node');
    if (parent) {
      parent.style.width = measuredWidth + 'px';
      parent.style.minHeight = Math.max(MIN_HEIGHT, el.scrollHeight + 60) + 'px';
    }
  }, [text]);

  const handleChange = (e) => {
    updateNodeField(id, 'text', e.target.value);
  };

  return (
    <div className="base-node">
      <div className="base-node-header">
        <span className="base-node-icon">📝</span>
        <span className="base-node-title">Text</span>
      </div>
      <div className="base-node-body">
        <label className="base-node-field">
          <span>Text</span>
          <textarea
            ref={textareaRef}
            className="text-node-textarea"
            value={text}
            onChange={handleChange}
            rows={1}
          />
        </label>
      </div>
      {variables.map((v, i) => (
        <Handle
          key={v}
          type="target"
          position={Position.Left}
          id={`${id}-${v}`}
          style={{ top: `${((i + 1) / (variables.length + 1)) * 100}%` }}
          className="handle-with-label"
          data-label={v}
        />
      ))}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
      />
    </div>
  );
};
