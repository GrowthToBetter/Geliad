import React from "react";

export default function Pengembang() {
  const developers = [
    { job: "General Manager", name: "Muhammad Chusni Agus, M.Pd., Gr." },
    { job: "Project Manager and Fullstack Developer", name: "Jean Richnerd Rantabaratrahjaga" },
    { job: "Software Architect and Data Ai Engineer", name: "Shabri Sebastian Siregar" },
    { job: "Human Resource and Public Relation ", name: "Syafakarim Akbar" },
  ];

  return (
    <div className="flex flex-col min-h-screen-minus-10">
      <div className="flex-grow mt-[100px] p-10 max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-[29px] font-medium text-Secondary mb-5">Developer Credit</h1>
          <div className="grid grid-cols-2 gap-y-2 gap-x-16 max-w-3xl">
            {developers.map((developer, index) => (
              <React.Fragment key={index}>
                <p className="xl:text-[18px] lg:text-[17px] md:text-[16px] sm:text-[15px] text-[14px] font-semibold text-black opacity-70">{developer.job}</p>
                <p className="xl:text-[18px] lg:text-[17px] md:text-[16px] sm:text-[15px] text-[14px] font-medium text-black opacity-70">{developer.name}</p>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
