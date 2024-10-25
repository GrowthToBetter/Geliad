"use client";
import { DeleteUser } from "@/utils/server-action/userGetServerSession";
import { Prisma } from "@prisma/client";
import React, { useEffect, useState } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import toast from "react-hot-toast";
import ModalUser from "./ModalUser";
import AddUser from "./AddUser";
import { userFullPayload } from "@/utils/relationsip";

export default function TableUser({ dataAdmin, userData }: { dataAdmin: Prisma.UserGetPayload<{ include: { userAuth: true } }>[]; userData: userFullPayload }) {
  const [modal, setModal] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const [modalData, setModalData] = useState<Prisma.UserGetPayload<{}> | null>(null);
  const [loader, setLoader] = useState(true);

  const columns: TableColumn<Prisma.UserGetPayload<{ include: { userAuth: true } }>>[] = [
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.role,
      sortable: true,
    },
    {
      name: "Last Login",
      selector: (row) => (row.userAuth?.last_login ? row.userAuth?.last_login.toUTCString() : "Never"),
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="flex gap-x-3">
          <button onClick={() => EditUser(row)} title="Edit" className="p-2 bg-blue-500 text-white rounded-lg hover:scale-110 active:scale-105 duration-150">
            edit
          </button>
          <button onClick={() => DeleteUserById(row.id)} title="Delete" className="p-2.5 bg-red-500 text-white rounded-md hover:scale-110 active:scale-105 duration-150">
            delete
          </button>
        </div>
      ),
    },
  ];
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  const EditUser = async (data: Prisma.UserGetPayload<{}>) => {
    setModal(true);
    setModalData(data);
  };

  const DeleteUserById = async (id: string) => {
    if (!confirm("Anda yakin ingin menghapus user ini?")) return;
    const toastId = toast.loading("Loading...");
    const result = await DeleteUser(id);
    if (result) {
      toast.success(result.message, { id: toastId });
    }
  };

  useEffect(() => {
    setLoader(false);
  }, []);

  if (loader) return <div>Loading</div>;

  return (
    <>
      <section className="w-full m-[10px] mt-[20px]">
        <section className="max-w-[1440px] min-h-full mx-auto w-full bg-[#F6F6F6] p-4 outline outline-1 outline-slate-200">
          <div className="flex justify-between items-center">
            <h5 className="text-[40px] font-bold mx-5 text-Secondary">Admin</h5>
            <AddUser userData={userData} />
          </div>
          <div className="w-full border-b-2 border-black "></div>
          <div className="mt-6">
            <DataTable data={dataAdmin} columns={columns} />
          </div>
        </section>
      </section>
      {modal && <ModalUser userData={userData} setIsOpenModal={setModal} data={modalData} />}
    </>
  );
}
