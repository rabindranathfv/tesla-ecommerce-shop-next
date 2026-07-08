import { titleFont } from "@/config/fonts";
import Image from "next/image";
import Link from "next/link";

export const PageNotFound = () => {
  return (
    <div className="flex flex-col-reverse md:flex-row h-[800px] w-full justify-center items-center align-middle">
      <div className=" text-center px-5 mx-5">
        {" "}
        <h2 className={`${titleFont.className} antialiased text-9xl`}>404</h2>
        <p className="font-semibold text-xl">Page Not Found</p>
        <p className="font-light text-lg">
          <span className={`${titleFont.className} antialiased`}>
            Sorry, the page you are looking for does not exist but you can go to{" "}
            <Link
              href="/"
              className="font-normal hover:underline transition-all"
            >
              Home
            </Link>
          </span>{" "}
        </p>
      </div>

      <div className="px-5 mx-5">
        <Image
          src="/imgs/starman_750x750.png"
          alt="Page Not Found Startman"
          width={550}
          height={550}
          loading="eager"
        />
      </div>
    </div>
  );
};
