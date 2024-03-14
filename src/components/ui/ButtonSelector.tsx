import { Button } from "~/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
// import { DataContext } from "~/lib/contexts/dataContext";
import { useSelector, useDispatch } from "react-redux";
import { next, previous } from "~/lib/slices/dataSlice";
import type { RootState } from "~/lib/store";

export const ButtonSelector: React.FC = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.data.items);
  const selectedIndex = useSelector(
    (state: RootState) => state.data.selectedIndex,
  );

  return (
    <>
      <div className="absolute top-0 flex h-full">
        <Button
          disabled={selectedIndex === 0}
          className="my-auto ml-4 bg-black bg-opacity-0 px-3 py-10 hover:bg-black hover:bg-opacity-10 focus:bg-black focus:bg-opacity-0 active:bg-black"
          onClick={() => dispatch(previous())}
        >
          <ChevronLeft size={32} strokeWidth={3} />
        </Button>
      </div>
      <div className="absolute right-0 top-0 flex h-full">
        <Button
          disabled={selectedIndex === items.length - 1}
          className="my-auto mr-4 bg-black bg-opacity-0 px-3 py-10 hover:bg-black hover:bg-opacity-10 focus:bg-black focus:bg-opacity-0 active:bg-black"
          onClick={() => dispatch(next())}
        >
          <ChevronRight size={32} strokeWidth={3} />
        </Button>
      </div>
    </>
  );
};
