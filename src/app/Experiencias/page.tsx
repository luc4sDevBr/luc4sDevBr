import Image from "next/image";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { Linkedin, Github } from "lucide-react"
import CarouselXP from "../../../public/Componentes/CarousselXP";

export default function Home() {
  return (
    <main className="w-screen h-screen">
      <section className="w-full h-full flex-col flex items-center justify-start gap-16 bg-white">
        <div className="w-auto">
          <ul className="w-auto mt-5 flex items-center text-xl text-center gap-5">
           
          </ul>
        </div>
        <div id="containerCentral" className="w-3/4 h-3/4 md:w-auto md:items-end md:h-3/4 bg-slate-700 rounded-md p-2 flex flex-col md:flex-row items-center">
            <div className="w-3/4">
              <CarouselXP />
            </div>
           
        </div>
      </section>
    </main>
  );
}
