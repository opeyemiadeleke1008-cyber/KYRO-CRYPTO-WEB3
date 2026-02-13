import React from "react";
import { MoveUpRight } from "lucide-react";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className="m-0 p-0 box-border bg-linear-to-r from-black/90 to-[#15393b] md:py-20 sm:py-20 py-10">
      <div className="flex justify-center items-center">
        <h1 className="text-3xl md:text-7xl font-semibold text-white w-[30%] animate-pulse">
          A New Era
        </h1>
        <p
          className="text-gray-300 md:w-[30%] w-[60%] text-sm md:text-[16px]"
          style={{ fontStyle: "italic" }}
        >
          Experience the future of finance with Kyro, the most advanced and
          secure cryptocurrency platform. Join thousands of users who have
          already made the switch to a decentralized future.
        </p>
      </div>
      <h2
        className="md:text-7xl text-3xl font-semibold text-white justify-self-center animate-pulse"
        style={{ fontStyle: "italic" }}
      >
        Of Cryptocurrency
      </h2>
      <div className="flex justify-between px-10 mt-5">
        <Link to="/signup">
          <button className="bg-orange-500 rounded-full px-6 text-lg md:text-xl flex md:py-3 py-2 items-center gap-1 font-semibold text-black cursor-pointer">
            Get Started
            <span>
              <MoveUpRight size={20} />
            </span>
          </button>
        </Link>
        <h2 className="md:text-7xl text-3xl font-semibold text-white animate-pulse">
          Exchange
        </h2>
      </div>
    </section>
  );
};

export default Hero;
