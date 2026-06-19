// Pipeline output node — receives Text or Image data from the pipeline
import { BaseNode } from './BaseNode';

export const OutputNode = ({ id, data }) => {
  const fields = [
    {
      key: 'outputName',
      label: 'Name',
      type: 'text',
      default: id.replace('customOutput-', 'output_'),
    },
    {
      key: 'outputType',
      label: 'Type',
      type: 'select',
      default: 'Text',
      options: [
        { value: 'Text', label: 'Text' },
        { value: 'Image', label: 'Image' },
      ],
    },
  ];

  const handles = [
    { type: 'target', position: 'left', id: 'value' },
  ];

  return (
    <BaseNode id={id} data={data} title="Output" icon="📤" fields={fields} handles={handles} />
  );
};
