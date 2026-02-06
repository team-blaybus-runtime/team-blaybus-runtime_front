"use client";

import { useParams } from "next/navigation";
import StudyLayout from "@/component/study/StudyLayout";

export default function StudyPage() {
  const params = useParams();
  const id = params.id as string;

  return <StudyLayout id={id} />;
}
