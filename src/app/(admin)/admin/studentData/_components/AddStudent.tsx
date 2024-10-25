"use client";
import { FormButton } from "@/app/components/utils/Button";
import React, {  useState } from "react";
import Modal from "./Modal";
import { userFullPayload } from "@/utils/relationsip";

export default function AddStudent({userData}:{userData:userFullPayload}) {
  const [modal, setModal] = useState(false);
  return (
    <>
      <FormButton type="button" variant="base" onClick={() => setModal(true)}>
        Add User
      </FormButton>
      {modal && <Modal userData={userData} setIsOpenModal={setModal} />}
    </>
  );
}
