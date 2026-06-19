// API node — configures an HTTP request with URL and method
import { BaseNode } from './BaseNode';

export const APINode = ({ id, data }) => {
  const fields = [
    {
      key: 'url',
      label: 'URL',
      type: 'text',
      default: 'https://api.example.com',
    },
    {
      key: 'method',
      label: 'Method',
      type: 'select',
      default: 'GET',
      options: [
        { value: 'GET', label: 'GET' },
        { value: 'POST', label: 'POST' },
        { value: 'PUT', label: 'PUT' },
        { value: 'DELETE', label: 'DELETE' },
      ],
    },
  ];

  const handles = [
    { type: 'target', position: 'left', id: 'body' },
    { type: 'source', position: 'right', id: 'response' },
  ];

  return (
    <BaseNode id={id} data={data} title="API" icon="🌐" fields={fields} handles={handles} />
  );
};
