import { Outlet, useOutlet } from "react-router-dom";

export function Evaluations() {
  const outlet = useOutlet();

  if (outlet) {
    return <Outlet />;
  }

  return (
    <div>
      <h1>Evaluations Page</h1>
    </div>
  );
}
