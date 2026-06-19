// Main canvas — renders the React Flow graph and handles drag-drop from the toolbar.

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { APINode } from './nodes/apiNode';
import { MathNode } from './nodes/mathNode';
import { ConditionNode } from './nodes/conditionNode';
import { FilterNode } from './nodes/filterNode';
import { MergeNode } from './nodes/mergeNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

// Registry — maps node type strings to their React components.
// These keys must match the type strings used in toolbar.js and store.js.
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  api: APINode,
  math: MathNode,
  condition: ConditionNode,
  filter: FilterNode,
  merge: MergeNode,
};

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      getNodeID: state.getNodeID,
      addNode: state.addNode,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
    })));

    const getInitNodeData = (nodeID, type) => {
      return { id: nodeID, nodeType: `${type}` };
    };

    // Handle drops from the toolbar — reads the node type from dataTransfer,
    // converts screen coordinates to canvas position, and creates the node.
    const onDrop = useCallback(
        (event) => {
          event.preventDefault();

          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;

            if (typeof type === 'undefined' || !type) {
              return;
            }

            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };

            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <div ref={reactFlowWrapper} className="reactflow-wrapper">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
            >
                <Background color="#aaa" gap={gridSize} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};
