import { useEffect, useRef, useMemo } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';
import { useStore } from '../store';

const MIN_WIDTH = 200;
const MAX_WIDTH = 400;
const MIN_HEIGHT = 80;

export const TextNode = ({ id, data }) => {
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeInternals = useUpdateNodeInternals();
  const textareaRef = useRef(null);
  const text = data.text ?? '{{input}}';

  // Fix 1: Use text.matchAll() instead of a module-level /g regex.
  // A global regex defined outside the component has a persistent lastIndex,
  // which can cause missed matches across renders (especially in React StrictMode).
  // matchAll() creates a fresh stateless iterator on every call — no stale state.
  const variables = useMemo(() => {
    const seen = new Set();
    const matches = [];
    for (const match of text.matchAll(/\{\{\s*(\w+)\s*\}\}/g)) {
      if (!seen.has(match[1])) {
        seen.add(match[1]);
        matches.push(match[1]);
      }
    }
    return matches;
  }, [text]);

  // Notify ReactFlow when handles change so it re-registers connection points
  useEffect(() => {
    updateNodeInternals(id);
  }, [variables.length, id, updateNodeInternals]);

  // Fix 2: Width + height auto-resize.
  // Previous approach used el.scrollWidth, which always returns the container
  // width when textarea has width:100% — so width never actually changed.
  // Solution: inject a hidden <span> with the same font, measure its rendered
  // width, then apply that to the parent .base-node wrapper.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    // --- Height ---
    // Reset to auto first so scrollHeight reflects actual content height
    el.style.height = 'auto';
    el.style.height = el.scrollHeight + 'px';

    // --- Width ---
    // Find the longest line in the text to determine how wide the node should be
    const lines = text.split('\n');
    const longestLine = lines.reduce((a, b) => (a.length > b.length ? a : b), '');

    // Measure rendered text width using a hidden span with matching font styles
    const span = document.createElement('span');
    span.style.cssText = `
      visibility: hidden;
      position: absolute;
      top: -9999px;
      left: -9999px;
      white-space: pre;
      font-size: 12px;
      font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      padding: 0 8px;
      letter-spacing: normal;
    `;
    span.textContent = longestLine || ' ';
    document.body.appendChild(span);
    const measuredTextWidth = span.offsetWidth;
    document.body.removeChild(span);

    // Add padding for label column + node borders
    const newWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, measuredTextWidth + 60));

    const parent = el.closest('.base-node');
    if (parent) {
      parent.style.width = newWidth + 'px';
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

      {/* Dynamic variable handles — one per {{ variable }} found in text */}
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

      {/* Fixed output handle on the right */}
      <Handle
        type="source"
        position={Position.Right}
        id={`${id}-output`}
      />
    </div>
  );
};
