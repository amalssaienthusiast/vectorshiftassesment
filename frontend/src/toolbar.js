import { DraggableNode } from './draggableNode';

export const PipelineToolbar = () => {

    return (
        <div className="toolbar">
            <div className="toolbar-section">
                <span className="toolbar-section-title">I/O</span>
                <div className="toolbar-nodes">
                    <DraggableNode type='customInput' label='Input' />
                    <DraggableNode type='customOutput' label='Output' />
                </div>
            </div>
            <div className="toolbar-section">
                <span className="toolbar-section-title">Processing</span>
                <div className="toolbar-nodes">
                    <DraggableNode type='llm' label='LLM' />
                    <DraggableNode type='text' label='Text' />
                    <DraggableNode type='api' label='API' />
                </div>
            </div>
            <div className="toolbar-section">
                <span className="toolbar-section-title">Logic</span>
                <div className="toolbar-nodes">
                    <DraggableNode type='math' label='Math' />
                    <DraggableNode type='condition' label='Condition' />
                    <DraggableNode type='filter' label='Filter' />
                    <DraggableNode type='merge' label='Merge' />
                </div>
            </div>
        </div>
    );
};
