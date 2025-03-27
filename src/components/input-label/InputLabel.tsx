import './InputLabel.scss';

interface InputLabelProps {
    labelText: string;
    children: React.ReactNode;
}

export const InputLabel: React.FC<InputLabelProps> = ({children, labelText}) => (
    <div className="input-label-wrapper">
        <span className="input-label">{labelText}</span>
        {children}
    </div>
);
