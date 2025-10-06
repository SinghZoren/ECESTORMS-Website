import { ReactNode } from 'react';

export interface SlideDefinition {
  id: string;
  render: () => ReactNode;
}
