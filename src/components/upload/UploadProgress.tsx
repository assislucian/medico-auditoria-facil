
import { Progress } from '@/components/ui/progress';

type UploadProgressProps = {
  progress: number;
  show: boolean;
};

const UploadProgress = ({ progress, show }: UploadProgressProps) => {
  if (!show) return null;

  return (
    <div className="space-y-2 mt-4">
      <div className="flex justify-between text-sm">
        <span>Enviando arquivos...</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};

export default UploadProgress;

