import React, { memo } from 'react';
import { MemoizedReactMarkdown } from '@/components/markdown';
import { CodeBlock } from '@/components/codeblock';

type MemoizedFunctionCallProps = {
  title: string;
  segment: string;
  code?: string;
  language?: string;
};

const MemoizedFunctionCall: React.FC<MemoizedFunctionCallProps> = ({ title, segment, code, language }) => {
  return (
    <div className="collapse collapse-arrow bg-base-200 top-0">
      <input type="checkbox" className="peer" defaultChecked />
      <div className="collapse-title bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content">
        {title}
      </div>
      <div className="collapse-content bg-primary text-primary-content peer-checked:bg-secondary peer-checked:text-secondary-content overflow-auto overflow-x-auto">
        <p>
          {code ? <CodeBlock language={language || 'function call'} value={code} /> : <MemoizedReactMarkdown>{segment}</MemoizedReactMarkdown>}
        </p>
      </div>
    </div>
  );
};

export default memo(MemoizedFunctionCall);