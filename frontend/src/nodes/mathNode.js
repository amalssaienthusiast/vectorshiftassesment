// Math node — performs arithmetic on two inputs (A and B)
import { BaseNode } from './BaseNode';

export const MathNode = ({ id, data }) => {
  const fields = [
    {
      key: 'operation',
      label: 'Operation',
      type: 'select',
      default: 'add',
      options: [
        { value: 'add', label: 'Add (+)' },
        { value: 'subtract', label: 'Subtract (−)' },
        { value: 'multiply', label: 'Multiply (×)' },
        { value: 'divide', label: 'Divide (÷)' },
      ],
    },
  ];

  const handles = [
    { type: 'target', position: 'left', id: 'a', offset: '33%' },
    { type: 'target', position: 'left', id: 'b', offset: '66%' },
    { type: 'source', position: 'right', id: 'result' },
  ];

  return (
    <BaseNode id={id} data={data} title="Math" icon="🔢" fields={fields} handles={handles} />
  );
};
