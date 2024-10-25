"use client";
import { FormButton } from "@/app/components/utils/Button";
import React, {  useState } from "react";
import { GenreFullPayload, userFullPayload } from "@/utils/relationsip";
import ModalGenre from "./ModalGenre";

export default function AddGenre({ userData}:{dataGenre:GenreFullPayload[]; userData:userFullPayload}) {
  const [modal, setModal] = useState(false);
  return (
    <>
      <FormButton type="button" variant="base" onClick={() => setModal(true)}>
        Add Genre
      </FormButton>
      {modal && <ModalGenre userData={userData} setIsOpenModal={setModal} />}
    </>
  );
}
