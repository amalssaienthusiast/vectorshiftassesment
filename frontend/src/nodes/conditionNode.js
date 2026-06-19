import { BaseNode } from './BaseNode';

export const ConditionNode = ({ id, data }) => {
  const fields = [
    {
      key: 'condition',
      label: 'Value',
      type: 'text',
      default: '',
    },
    {
      key: 'operator',
      label: 'Operator',
      type: 'select',
      default: '==',
      options: [
        { value: '==', label: 'Equals (==)' },
        { value: '!=', label: 'Not Equals (!=)' },
        { value: '>', label: 'Greater Than (>)' },
        { value: '<', label: 'Less Than (<)' },
        { value: 'contains', label: 'Contains' },
      ],
    },
  ];

  const handles = [
    { type: 'target', position: 'left', id: 'input' },
    { type: 'source', position: 'right', id: 'true', offset: '33%' },
    { type: 'source', position: 'right', id: 'false', offset: '66%' },
  ];

  return (
    <BaseNode id={id} data={data} title="Condition" icon="🔀" fields={fields} handles={handles} />
  );
};
