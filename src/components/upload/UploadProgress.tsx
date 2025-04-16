
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Loader2 } from 'lucide-react';

type UploadProgressProps = {
  progress: number;
  show: boolean;
  stage?: 'extracting' | 'analyzing' | 'comparing' | 'complete' | 'idle';
};

/**
 * UploadProgress Component
 * 
 * Displays a progress bar indicating the current status of file processing.
 * Includes different stages of processing with appropriate visual feedback.
 * 
 * @param progress - Current progress percentage (0-100)
 * @param show - Whether to show the progress bar
 * @param stage - Current processing stage
 */
const UploadProgress = ({ progress, show, stage = 'idle' }: UploadProgressProps) => {
  if (!show) return null;

  const isComplete = stage === 'complete';
  
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="flex items-center gap-1.5">
          {isComplete ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <Loader2 className="h-4 w-4 animate-spin text-medblue-500" />
          )}
          <span>
            {stage === 'extracting' && 'Extraindo dados dos documentos...'}
            {stage === 'analyzing' && 'Analisando com tabela CBHPM 2015...'}
            {stage === 'comparing' && 'Comparando valores pagos...'}
            {stage === 'complete' && 'Processamento concluído'}
            {stage === 'idle' && 'Progresso'}
          </span>
        </span>
        <span className="font-medium">{progress}%</span>
      </div>
      <Progress 
        value={progress} 
        className={`h-2 ${isComplete ? 'bg-green-100' : ''}`}
        {...(isComplete && { className: "h-2 bg-muted [&>div]:bg-green-500" })}
      />
    </div>
  );
};

export default UploadProgress;
