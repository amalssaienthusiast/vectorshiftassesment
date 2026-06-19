// Filter node — passes through data matching a field condition
import { BaseNode } from './BaseNode';

export const FilterNode = ({ id, data }) => {
  const fields = [
    {
      key: 'field',
      label: 'Field',
      type: 'text',
      default: '',
    },
    {
      key: 'filterCondition',
      label: 'Match',
      type: 'select',
      default: 'contains',
      options: [
        { value: 'contains', label: 'Contains' },
        { value: 'startsWith', label: 'Starts With' },
        { value: 'endsWith', label: 'Ends With' },
        { value: 'regex', label: 'Regex' },
      ],
    },
  ];

  const handles = [
    { type: 'target', position: 'left', id: 'input' },
    { type: 'source', position: 'right', id: 'output' },
  ];

  return (
    <BaseNode id={id} data={data} title="Filter" icon="🔍" fields={fields} handles={handles} />
  );
};
