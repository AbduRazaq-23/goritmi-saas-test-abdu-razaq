import { useAuth } from "../../context/AuthContext";

const TopBar = () => {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 w-full z-50 bg-gray-900 text-gray-100 border-b p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="text-sm ">
          Welcome back,{" "}
          <span className="font-medium text-gray-300">
            {loading ? "Loading..." : user?.name || "User"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
          {user?.name?.[0]?.toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
};
export default TopBar;
