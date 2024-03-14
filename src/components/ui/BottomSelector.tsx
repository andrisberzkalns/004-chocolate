import React from "react";
// import { DataContext } from "~/lib/contexts/dataContext";
import { useSelector, useDispatch } from "react-redux";
import { next, previous } from "~/lib/slices/dataSlice";
import type { RootState } from "~/lib/store";
import { Home } from "lucide-react";

export const BottomSelector: React.FC = () => {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.data.items);
  const selectedIndex = useSelector(
    (state: RootState) => state.data.selectedIndex,
  );

  const Bar: React.FC<{
    selected?: boolean;
    mini?: boolean;
    label?: string;
    onClick?: () => void;
  }> = ({ label, selected = false, mini = false, onClick }) => {
    return (
      <div
        onClick={onClick}
        className={`duration-250 relative h-16 transition ${
          mini ? "w-2" : "w-full hover:cursor-pointer"
        }`}
      >
        <div
          className={`duration-250 absolute bottom-2 h-1 w-full rounded-lg bg-white transition ${
            selected
              ? "h-2 opacity-90"
              : "bg-opacity-30 opacity-60 hover:bg-opacity-40 hover:opacity-90"
          }`}
        >
          <div
            className={`absolute bottom-3 mx-auto flex h-5 w-full select-none justify-center text-white transition`}
          >
            <div>{label == "Home" ? <Home /> : label}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="absolute bottom-0 mb-4 w-full px-4">
      <div className="mx-auto flex max-w-[720px] flex-row gap-4">
        <div className="flex flex-1 justify-end gap-4">
          {items
            .filter((_, index) => index < selectedIndex - 1)
            .map((item) => (
              <Bar key={item.key} mini />
            ))}
          {items
            .filter((_, index) => index == selectedIndex - 1)
            .map((item) => (
              <Bar
                key={item.key}
                onClick={() => dispatch(previous())}
                label={item.label}
              />
            ))}
        </div>

        <div className="flex-1">
          <Bar selected label={items[selectedIndex]!.label} />
        </div>
        <div className="flex flex-1 justify-start gap-4">
          {items
            .filter((_, index) => index == selectedIndex + 1)
            .map((item) => (
              <Bar
                key={item.key}
                onClick={() => dispatch(next())}
                label={item.label}
              />
            ))}
          {items
            .filter((_, index) => index > selectedIndex + 1)
            .map((item) => (
              <Bar key={item.key} mini />
            ))}
        </div>
      </div>
    </div>
  );
};
