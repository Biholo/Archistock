import React, { useState, useEffect } from "react";
import AsideItem from "../AsideItem/AsideItem";
import { useAuth } from "../../contexts/AuthContext";
import {
  Cloud,
  Lightning,
  UploadSimple,
  Sliders,
  Cube,
  User,
  X,
  ChartLine,
  Factory,
  Detective,
  SignOut
} from "@phosphor-icons/react";
import Button from "../Button/Button";

export default function Aside() {
  const { handleLogout } = useAuth();
  const { user } = useAuth();
  const [active, setActive] = useState("storage" as string);

  useEffect(() => {
    setActive(window.location.pathname.split("/")[1]);
  }, [window.location.pathname]);

  const handleChangeItem = (item: string) => {
    setActive(item);
  };

  return (
    <React.Fragment>
      <div className="flex flex-col h-[96%] my-4 mx-4">
        <div className="title flex flex-row justify-center md:justify-between items-center max-w-[200px]">
          <h1>
            <span className="font-bold hidden md:block text-lg xl:text-xl">
              🔗ArchiStock
            </span>
            <span className="font-black block md:hidden text-xl text-center">
              AS
            </span>
          </h1>
          <p className="text-xs hidden lg:block">1.0.0</p>
        </div>
        <hr className="w-full h-0.5 mx-auto my-4 bg-gray-300 border-0 rounded" />
        <div className="flex h-full flex-col justify-between">
          <div className="flex h-full flex-col gap-2">
            <AsideItem
              title="Vos abonnements"
              icon={<Cloud size={26} weight="bold" />}
              link="storage"
              active={active === "storage"}
              onClick={() => handleChangeItem("storage")}
            ></AsideItem>
            <AsideItem
              title="Nos offres"
              icon={<Lightning size={26} weight="bold" />}
              link="extend"
              active={active === "extend"}
              onClick={() => handleChangeItem("extend")}
            ></AsideItem>
            <AsideItem
              title="Télécharger"
              icon={<UploadSimple size={26} weight="bold" />}
              link="upload"
              active={active === "upload"}
              onClick={() => handleChangeItem("upload")}
            ></AsideItem>
            <AsideItem
              title="Components"
              icon={<Cube size={26} />}
              link="components"
              active={active === "components"}
              onClick={() => handleChangeItem("components")}
            ></AsideItem>
            {
              user && user.role === 'admin' && (
                <AsideItem
                  title="Administrateur"
                  icon={<Detective size={26} /> }
                  link="administrator"
                  active={active === "administrator"}
                  onClick={() => handleChangeItem("administrator")}
                >
                </AsideItem>
              )
            }
          </div>
          <div className="flex flex-row justify-between w-full flex-wrap items-center gap-2">
            <div className="flex-grow">
            <AsideItem
              title="Profile"
              icon={<User size={26} weight="bold" />}
              link="profile"
              active={active === "profile"}
              onClick={() => handleChangeItem("profile")}
            ></AsideItem>
            </div>
            <a href="/login" className="hover:bg-error hover:text-white rounded-xl transition-all p-3" onClick={handleLogout}>
              <SignOut size={26} />
            </a>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
