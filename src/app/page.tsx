import Image from "next/image";

export default function Home() {
  return (
    <main className=" w-screen h-screen">
      <section className="w-full h-full flex-col flex items-center justify-start gap-16 bg-white">
        <div className=" w-auto">

          <ul className=" w-auto mt-5 flex items-center text-xl  text-center gap-5">
            <li>Sobre</li>
            <li>Experiencias</li>
            <li>Trabalhos</li>
            <li>Contatos</li>
          </ul>
        </div>
        <center id="containerCentral" className=" w-3/4 h-3/4 bg-slate-700 rounded-md p-2 ">
         
          <div id="containerText" className=" w-full  h-full flex items-center">
            <div id="containerText" className=" w-1/2 p-10 text-left">
              <h1 className=" text-3xl font-bold text-teal-50">A Vida na Aldeia</h1>
              <span className=" text-sm text-white text-left break-words tablet:text-lg phone:text-sm">Em uma aldeia tranquila, cercada por colinas e um rio sereno, a vida seguia em harmonia com a natureza. As manhãs começavam com o canto dos pássaros e o aroma do pão fresco.</span>
            </div>
          </div>
          <div id="containerlOGO" className=" w-40 h-40 absolute bottom-5/7 left-3/4 bg-gray-500 border-8 border-white rounded-full"></div>
          <div id="containerButtons" className=" w-2/5 h-24 absolute bottom-10 left-32 bg-gray-500 border-8 border-white rounded-full"></div>
        </center>
      </section>
      
    </main>
  );
}
