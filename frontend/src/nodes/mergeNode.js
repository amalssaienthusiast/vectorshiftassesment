import { BaseNode } from './BaseNode';

export const MergeNode = ({ id, data }) => {
  const fields = [
    {
      key: 'strategy',
      label: 'Strategy',
      type: 'select',
      default: 'concat',
      options: [
        { value: 'concat', label: 'Concatenate' },
        { value: 'zip', label: 'Zip' },
        { value: 'interleave', label: 'Interleave' },
      ],
    },
  ];

  const handles = [
    { type: 'target', position: 'left', id: 'input1', offset: '33%' },
    { type: 'target', position: 'left', id: 'input2', offset: '66%' },
    { type: 'source', position: 'right', id: 'output' },
  ];

  return (
    <BaseNode id={id} data={data} title="Merge" icon="🔗" fields={fields} handles={handles} />
  );
};
