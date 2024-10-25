"use client";
import { FormButton } from "@/app/components/utils/Button";
import React, { useState } from "react";
import ModalUser from "./ModalUser";
import { userFullPayload } from "@/utils/relationsip";

export default function AddUser({userData}:{userData:userFullPayload}) {
  const [modal, setModal] = useState(false);
  return (
    <>
      <FormButton type="button" variant="base" onClick={() => setModal(true)}>
        Add User
      </FormButton>
      {modal && <ModalUser userData={userData} setIsOpenModal={setModal} />}
    </>
  );
}
