import React from 'react';
import { HomeIcon } from '@heroicons/react/24/outline';

export interface Props {
  icon: (props: React.ComponentProps<'svg'>) => JSX.Element;
  label: string;
}

export const IconButton = ({ icon: Icon, label }: Props) => {
  return (
    <button className="flex items-center space-x-2 hover:text-white">
      <Icon className="icon" />
      <span>{label}</span>
    </button>
  );
};
