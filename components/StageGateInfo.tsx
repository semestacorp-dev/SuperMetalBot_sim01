
import React, { useState } from 'react';
import { StageGateDetails } from '../types';

interface StageGateInfoProps {
  details: StageGateDetails;
}

const StageGateInfo: React.FC<StageGateInfoProps> = ({ details }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gray-200 dark:bg-gray-800 rounded-lg p-3 text-sm border border-gray-300 dark:border-gray-700 shadow-inner">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left font-semibold text-gray-800 dark:text-gray-200 flex justify-between items-center focus:outline-none"
      >
        <span>Stage Gate Compliance Details</span>
        <svg
          className={`h-4 w-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3 border-t border-gray-300 dark:border-gray-700 pt-3 text-gray-700 dark:text-gray-300">
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Simulated Internal Data Product (Raw):</h4>
            <pre className="whitespace-pre-wrap p-2 bg-gray-100 dark:bg-gray-900 rounded-md mt-1 text-xs">
              <code className="text-red-500">// PII/SPD fields (NIK, NamaLengkap) are shown here for illustration but would be strictly prohibited in actual transit to external LLMs.</code>{`\n`}
              {JSON.stringify(details.rawInternalData, null, 2)}
            </pre>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Sanitized Factual Context (to LLM):</h4>
            <pre className="whitespace-pre-wrap p-2 bg-gray-100 dark:bg-gray-900 rounded-md mt-1 text-xs">
              <code className="text-green-500">// Only non-PII, factual context is sent after sanitization.</code>{`\n`}
              {details.sanitizedContextJson}
            </pre>
          </div>

          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100">Final Prompt to Gemini LLM:</h4>
            <pre className="whitespace-pre-wrap p-2 bg-gray-100 dark:bg-gray-900 rounded-md mt-1 text-xs">
              {details.finalPromptToLLM}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export { StageGateInfo };
