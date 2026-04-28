import type { ReactNode } from "react";

const PageContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="w-full h-full overflow-y-auto p-6 flex flex-col gap-4 bg-neutral-default-default">
      {children}
    </div>
  );
};

export default PageContainer;
