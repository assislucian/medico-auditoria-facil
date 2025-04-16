
import { Progress } from '@/components/ui/progress';

type UploadProgressProps = {
  progress: number;
  show: boolean;
};

/**
 * UploadProgress Component
 * 
 * Displays a progress bar indicating the current status of file processing.
 * 
 * @param progress - Current progress percentage (0-100)
 * @param show - Whether to show the progress bar
 */
const UploadProgress = ({ progress, show }: UploadProgressProps) => {
  if (!show) return null;

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>Progresso</span>
        <span className="font-medium">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default UploadProgress;
