import { BaseNode } from './BaseNode';

export const InputNode = ({ id, data }) => {
  const fields = [
    {
      key: 'inputName',
      label: 'Name',
      type: 'text',
      default: id.replace('customInput-', 'input_'),
    },
    {
      key: 'inputType',
      label: 'Type',
      type: 'select',
      default: 'Text',
      options: [
        { value: 'Text', label: 'Text' },
        { value: 'File', label: 'File' },
      ],
    },
  ];

  const handles = [
    { type: 'source', position: 'right', id: 'value' },
  ];

  return (
    <BaseNode id={id} data={data} title="Input" icon="📥" fields={fields} handles={handles} />
  );
};
