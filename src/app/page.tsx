import Image from "next/image";
import {Button} from "@nextui-org/button";
import Link from "next/link";
import { Linkedin, Github } from "lucide-react"

export default function Home() {
  return (
    <main className="w-screen h-screen">
      <section className="w-full h-full flex-col flex items-center justify-start gap-16 bg-white">
        <div className="w-auto">
          <ul className="w-auto mt-5 flex items-center text-xl text-center gap-5">
           
          </ul>
        </div>
        <div id="containerCentral" className="w-full h-3/4 md:w-3/4 md:items-end md:h-3/4 bg-slate-700 rounded-md p-2 flex flex-col md:flex-row items-center">
          <div id="containerText" className="w-full h-full flex flex-col justify-center md:flex md:items-start md:w-full md:h-auto  items-center">
             
            <div
              id="containerText2"
              className="w-full  md:w-1/2 p-4 md:p-10 text-left"
            >
              <h1 className="text-3xl font-bold text-teal-50">A Vida na Aldeia</h1>
              <span className="text-sm text-white break-words">
                Em uma aldeia tranquila, cercada por colinas e um rio sereno, a vida seguia em harmonia com a natureza. As manhãs começavam com o canto dos pássaros e o aroma do pão fresco.
              </span>
             
            </div>
            <div className="w-full flex p-4 gap-2 md:w-full md:p-10 md:flex md:justify-end md:items-end ">
                <Link className=" " href={"https://www.linkedin.com/in/lucas-conrado-784a571a1/"}>
                  <Button className="">
                    <Linkedin color="#ffffff"/>
                  </Button>
                </Link>
                <Link className=" " href={"https://github.com/luc4sDevBr"}>
                  <Button className="">
                    <Github color="#ffffff"/>
                  </Button>
                </Link>
            </div>
          </div>
          <div
            id="containerlOGO"
            className="w-40 h-40 absolute bottom-5/7 flex md:w-40 md:h-40 md:absolute md:bottom-5/7 md:left-3/4 bg-gray-500 border-8 border-white rounded-full"
          > </div>
       
          <div
            id="containerButtons"
            className=" w-full h-20 bottom-10 absolute flex items-center md:w-1/2 md:h-20 md:absolute md:bottom-10 md:left-20 bg-gray-500 border-8 border-white rounded-full"
          >
            <div className="w-full justify-center">
                <ul className="w-auto flex items-center justify-evenly text-white font-light text-sm text-center gap-5 md:w-auto md:text-xl">
                  <Link className=" " href={"/"}>
                    <Button className="">
                      <li>Sobre</li>
                    </Button>
                  </Link>
                  <Link className=" " href={"/Experiencias"}>
                    <Button className="">
                      <li>Experiencias</li>
                    </Button>
                  </Link>
                  <Link className=" " href={"/"}>
                    <Button className="">
                      <li>Trabalhos</li>
                    </Button>
                  </Link>
                  <Link className=" " href={"/"}>
                    <Button className="">
                      <li>Contatos</li>
                    </Button>
                  </Link>
                </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
