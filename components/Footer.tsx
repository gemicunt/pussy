import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-900 py-6 text-center border-t border-neutral-700">
      <p className="text-sm text-neutral-500">
        Ritual Invoker &copy; {new Date().getFullYear()}. For educational and illustrative purposes.
      </p>
      <p className="text-xs text-neutral-600 mt-1">
        Design inspired by the provided API specification.
      </p>
    </footer>
  );
};