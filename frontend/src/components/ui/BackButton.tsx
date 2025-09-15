import * as React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";

// mở rộng ButtonProps, thêm iconClassName và showText
interface BackButtonProps extends Omit<ButtonProps, "onClick"> {
  showText?: boolean;
  iconClassName?: string; // thêm dòng này
  onClick?: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({
  className,
  iconClassName = "",
  showText = false,
  onClick,
  size = "sm",
  variant = "ghost",
  ...props
}) => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (onClick) return onClick();
    navigate(-1);
  };

  return (
    <Button
      onClick={handleGoBack}
      variant={variant}
      size={size}
      className={`flex items-center gap-1 ${className ?? ""}`}
      {...props}
    >
      <ArrowLeftIcon className={`w-4 h-4 ${iconClassName}`} />

    </Button>
  );
};

export default BackButton;
