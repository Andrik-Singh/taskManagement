"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { or } from "drizzle-orm";
import { createNewLink } from "@/server/invite";

const CopyLinkButton = ({ id }: { id: string }) => {
  const [copying, setCopying] = useState(false);
  const handleCopy = async () => {
    try {
      setCopying(true);
      const token=await createNewLink(null,id)
      const url = `${window.location.origin}/dashboard/projects/${id}/join-project`;
      console.log(url);
      await navigator.clipboard.writeText(url);
      setTimeout(() => {
        setCopying(false);
      }, 3000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      setCopying(false);
    }
  };
  return (
    <Button
      variant={"secondary"}
      className="cursor-pointer"
      disabled={copying}
      onClick={() => {
        handleCopy();
      }}
    >
      {copying ? "Copying..." : "Copy Link"}
    </Button>
  );
};

export default CopyLinkButton;
