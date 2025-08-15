import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
const CopyButton = ({
  data,
  className = '',
}: {
  data: any;
  className?: string;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1 hover:bg-muted/50 rounded transition-colors ${className}`}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />
      )}
    </button>
  );
};
export const ToastApi = (response: any) => {
  process.env.NODE_ENV === 'development' &&
    toast(
      <div className="space-y-4 min-w-0 max-w-[400px]">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium">Response API: </div>
          <CopyButton data={response} />
        </div>
        <div className="text-xs bg-muted p-2 rounded max-h-40 overflow-x-auto overflow-y-auto w-80 whitespace-pre min-w-0 min-h-[300px] max-w-[400px]">
          {JSON.stringify(response, null, 2)}
        </div>
      </div>,
      {
        position: 'bottom-right',
        style: { maxWidth: '450px', minWidth: '350px' },
      }
    );
};
