import { titleFont } from "@/config/fonts";

interface TitleProps {
  title?: string;
  subtitle?: string;
  className?: string;
}
export const Title = ({ title, subtitle, className }: TitleProps) => {
  return (
    <div className={`mt-3 ${className}`}>
      {title && (
        <h1
          className={`${titleFont.className} antialiased text-4xl font-semibold my-7`}
        >
          {title}
        </h1>
      )}
      {subtitle && <h2 className="text-xl mb-5">{subtitle}</h2>}
    </div>
  );
};
