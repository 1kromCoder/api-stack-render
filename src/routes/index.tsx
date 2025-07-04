import { Button } from "@/components/ui/button";
import Create from "@/pages/Create";
import Home from "@/pages/Home";
import { NavLink, Route, Routes, useNavigate } from "react-router-dom";

export const PageRoutes = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="flex justify-between items-center p-4 bg-gray-600 mb-5">
        <div>
          <NavLink to={"/"} className="font-bold text-[20px] text-white">
            Stacks
          </NavLink>
        </div>
        <Button onClick={() => navigate("/create")} className="bg-blue-600">
          Create Stack
        </Button>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </>
  );
};
