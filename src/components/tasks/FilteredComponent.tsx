"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

const FilteredComponent = () => {
  const params = useSearchParams();
  const router = useRouter();
  const completedParams = params.get("completed") || "all";
  const priorityParams = params.get("priority") || "all";
  const sortByParams = params.get("sortBy") || "none";
  const [completed, setCompleted] = useState(completedParams);
  const [priority, setPriority] = useState(priorityParams);
  const [sortBy, setSortBy] = useState(sortByParams);
  const [loading, setLoading] = useState(false);
  const hasChanges =
    completedParams === completed &&
    priorityParams == priority &&
    sortByParams === sortBy;
  const activeFilterCount = [
    completed !== "all",
    priority !== "all",
    sortBy !== "none",
  ].filter(Boolean).length;
  const pushRouter = () => {
    setLoading(true);
    const allParams = new URLSearchParams(params.toString());
    allParams.set("completed", completed);
    allParams.set("priority", priority);
    allParams.set("sortBy", sortBy);
    router.push(`?${allParams.toString()}`);
  };
  const clearFilters = () => {
    setLoading(true);
    const allParams = new URLSearchParams(params.toString());
    allParams.set("completed", "all");
    allParams.set("priority", "all");
    allParams.set("sortBy", "none");
    router.push(`?${allParams.toString()}`);
  };
  return (
    <div className="space-y-4 m-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({activeFilterCount} active)
            </span>
          )}
        </h1>
        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear all
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={completed} onValueChange={setCompleted}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select completion status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Show which tasks</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="incomplete">Incomplete</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Priority</SelectLabel>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="createdAt.Desc">Created (Newest)</SelectItem>
              <SelectItem value="createdAt.Asc">Created (Oldest)</SelectItem>
              <SelectItem value="dueDate.Desc">Due Date (Latest)</SelectItem>
              <SelectItem value="dueDate.Asc">Due Date (Earliest)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <Button disabled={hasChanges || loading} onClick={pushRouter}>
          {loading ? "Applying..." : "Apply filters"}
        </Button>
      </div>
    </div>
  );
};

export default FilteredComponent;
