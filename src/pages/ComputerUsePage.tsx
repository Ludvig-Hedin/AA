import React from 'react';
import { ComputerUse } from '@/components/ComputerUse';
import { PageHeader } from '@/components/PageHeader';
import { PageContainer } from '@/components/PageContainer';

export function ComputerUsePage() {
  return (
    <PageContainer>
      <PageHeader 
        title="Computer Use" 
        subtitle="Let AI control your computer to perform tasks on your behalf"
      />
      <div className="mt-6">
        <ComputerUse />
      </div>
    </PageContainer>
  );
}

export default ComputerUsePage; 