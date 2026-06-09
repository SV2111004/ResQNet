import { useSelector } from "react-redux";

function Navbar() {

  const { user } =
    useSelector((state) => state.auth);

  return (
    <div className="h-16 border-b border-slate-800 flex items-center justify-between px-6">

      <h2 className="font-semibold">
        Emergency Operations Center
      </h2>

      <div>
        {user?.user?.name}
      </div>

    </div>
  );
}

export default Navbar;