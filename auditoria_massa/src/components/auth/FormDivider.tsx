
interface FormDividerProps {
  text?: string;
}

const FormDivider = ({ text = 'ou' }: FormDividerProps) => {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-muted"></div>
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">{text}</span>
      </div>
    </div>
  );
};

export default FormDivider;
