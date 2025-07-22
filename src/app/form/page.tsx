"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FormPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/form/step1");
  }, [router]);

  return null;
}
