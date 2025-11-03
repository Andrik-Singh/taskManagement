"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";

const PaginationComponent = ({ totalPages }: { totalPages: number }) => {
  const router = useRouter();
  const params = useSearchParams();
  const pageParams = params.get("page");
  const [page, setPage] = useState(
    Number.isNaN(pageParams) || Number(pageParams) < 1 ? 1 : Number(pageParams)
  );
  const changeParams = () => {
    const allParams = new URLSearchParams(params.toString());
    allParams.set("page", String(page));
    router.push(`?${allParams}`);
  };
  return (
    <div>
      <Button
        onClick={() => {
          setPage((prev) => prev--);
          changeParams();
        }}
        variant={"ghost"}
        disabled={page <= totalPages}
      >
        Previous
      </Button>
      <Button variant={"ghost"}>{page}</Button>
      <Button
        onClick={() => {
          setPage((prev) => prev--);
        }}
        variant={"ghost"}
        disabled={page >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default PaginationComponent;
