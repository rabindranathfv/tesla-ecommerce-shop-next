import { montserratAlternatesTitleFonts } from "@/config/fonts";

export default function Home() {
  return (
    <div className="">
      <h1 className="">Hello Shop</h1>
      <h1 className={montserratAlternatesTitleFonts.className}>World</h1>
    </div>
  );
}
