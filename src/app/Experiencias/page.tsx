import Image from "next/image";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { Linkedin, Github } from "lucide-react"
import CarouselXP from "../../components/CarousselXP";

export default function Home() {
  return (
    <main className="w-screen h-screen">
      <section className="w-full h-full flex-col flex items-center justify-start gap-16 bg-slate-600">
        <CarouselXP />
      </section>
    </main>
  );
}
