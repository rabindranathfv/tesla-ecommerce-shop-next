import { Size } from "@/interfaces";
import clsx from "clsx";

interface props {
  selectedSize?: Size;
  availableSizes: Size[];

  onSizeChanged: (size: Size) => void;
}

export const SizeSelector = ({
  selectedSize,
  availableSizes,
  onSizeChanged,
}: props) => {
  return (
    <div className="my-5">
      <h3 className="font-bold mb-4">Available Sizes</h3>
      <div className="flex">
        {availableSizes.map((size) => (
          <button
            key={size}
            className={clsx("mx-2 hover:underline text-lg", {
              underline: selectedSize === size,
            })}
            onClick={() => onSizeChanged(size)}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};
