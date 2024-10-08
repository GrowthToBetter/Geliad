import Link from "next/link";

export default function Card({bgImage, nama, LinktoVisit}: {bgImage: string, nama: string, LinktoVisit: string}) {
    return (
        
          <div className="w-64 rounded-lg m-10 h-80 bg-cover bg-no-repeat relative" style={{backgroundImage:`url(${bgImage})`}}>
            <div className="bg-gradient-to-t from-black mix-blend-multiply to-white w-full h-2/3 bottom-0 absolute"></div>
            <div className="flex justify-start m-3 w-full h-fit absolute flex-col bottom-0">
              <h1 className="text-white font-bold border-b-2 w-56 border-b-secondary text-xl relative bottom-0">
                {nama}
              </h1>
              <Link href={LinktoVisit} className="text-white hover:text-Primary">Visit now!</Link>
            </div>
          </div>
    )
}