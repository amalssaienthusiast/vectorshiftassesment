// LLM node — takes a system prompt and user prompt, outputs a response
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const handles = [
    { type: 'target', position: 'left', id: 'system', offset: '33%' },
    { type: 'target', position: 'left', id: 'prompt', offset: '66%' },
    { type: 'source', position: 'right', id: 'response' },
  ];

  return (
    <BaseNode id={id} data={data} title="LLM" icon="🤖" fields={[]} handles={handles}>
      <span className="base-node-info">This is a LLM.</span>
    </BaseNode>
  );
};
