import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import Logo from "../../../public/assets/logist-icon.webp"
import personLogo from "../../../public/assets/icon-person.webp"

export default function Header() {

  const authorized = localStorage.getItem("token");

  return (
    <header>
      <div>
        {!authorized ? (
          <div className="flex justify-end space-x-10 w-[1250px] m-auto">
            <Link
              to={"/"}
              activeProps={{ className: "text-blue-600 font-bold text-xl" }}
              inactiveProps={{ className: "text-gray-600 text-lg" }}
            >
              Home
            </Link>

            <Link
              to={"/login"}
              activeProps={{ className: "text-blue-600 font-bold text-xl" }}
              inactiveProps={{ className: "text-gray-600 text-lg" }}
            >
              Login
            </Link>
          </div>
        ) : (
            <>
            <div className="container  bg-yellow-50 ">
            <div className=" flex max-w-[1250px] m-auto justify-between items-center h-[100px]">
              
              {/* Left section (Logo) */}
              <div className="w-[50px] text-left mb-2 ml-[10px]">
                <img src={Logo} alt="Logo" />
              </div>
              
              {/* Middle section (Title and Buttons) */}
              <div className="flex space-x-10 justify-center flex-1">
                <h1 className="text-xl font-semibold">Dispecher</h1>
                <div className="flex space-x-16">
                  <Button variant={"destructive"}>
                    Buyurtmalar
                  </Button>
                  <Button variant={"secondary"}>
                    To'ldirish
                  </Button>
                  <Button variant={"secondary"}>
                    Status
                  </Button>
                </div>
              </div>
              
              {/* Right section (Order creation and profile image) */}
              <div className="flex items-center space-x-10">
                <Link
                  to={"/login"}
                  activeProps={{ className: "text-blue-600 font-bold text-xl" }}
                  inactiveProps={{ className: "text-gray-600 text-lg" }}
                >
                  <Button variant={"orange"} size={"lg"}>
                    + Buyurtma yaratish
                  </Button>
                </Link>
                
                <div className="w-[50px] text-left mb-2">
                  <img src={personLogo} className="rounded-full" alt="Profile" />
                </div>
              </div>
            
            </div>
          </div>
          
          </>
        )}
      </div>
    </header>
  );
}