import React from 'react';

interface JsonViewerProps {
  data: any;
  className?: string;
}

export const JsonViewer: React.FC<JsonViewerProps> = ({ data, className }) => {
  return (
    <pre className={`bg-black text-neutral-300 p-3 rounded-md overflow-x-auto text-xs border border-neutral-700 ${className}`}>
      <code>{JSON.stringify(data, null, 2)}</code>
    </pre>
  );
};