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
  Factory
} from "@phosphor-icons/react";

export default function Aside() {
  const { handleLogout } = useAuth();
  const [active, setActive] = useState("storage" as string);

  useEffect(() => {
    setActive(window.location.pathname.split("/")[1]);
  }, [window.location.pathname]);

  const handleChangeItem = (item: string) => {
    setActive(item);
  };

  return (
    <React.Fragment>
      <div className="flex flex-col my-4 mx-4">
        <div className="title flex flex-row justify-center md:justify-between items-center">
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
        <AsideItem
          title="Your storage"
          icon={<Cloud size={20} weight="bold" />}
          link="storage"
          active={active === "storage"}
          onClick={() => handleChangeItem("storage")}
        ></AsideItem>
        <AsideItem
          title="Extend storage"
          icon={<Lightning size={20} weight="bold" />}
          link="extend"
          active={active === "extend"}
          onClick={() => handleChangeItem("extend")}
        ></AsideItem>
        <AsideItem
          title="Upload files"
          icon={<UploadSimple size={20} weight="bold" />}
          link="upload"
          active={active === "upload"}
          onClick={() => handleChangeItem("upload")}
        ></AsideItem>
        <AsideItem
          title="Components"
          icon={<Cube size={20} />}
          link="components"
          active={active === "components"}
          onClick={() => handleChangeItem("components")}
        ></AsideItem>
        <AsideItem
          title="Statistics"
          icon={<ChartLine size={20} />}
          link="statistics"
          active={active === "statistics"}
          onClick={() => handleChangeItem("statistics")}
        ></AsideItem>
        <AsideItem
          title="Profil"
          icon={<User size={20} />}
          link="profile"
          active={active === "profile"}
          onClick={() => handleChangeItem("profile")}
        ></AsideItem>
        // ContactSupport
        <AsideItem
          title="Contact Support"
          icon={<User size={20} />}
          link="contact-support"
          active={active === "contact-support"}
          onClick={() => handleChangeItem("contact-support")}
        ></AsideItem>
        // AnswerClient
        <AsideItem
          title="Answer Client"
          icon={<User size={20} />}
          link="answer-client"
          active={active === "answer-client"}
          onClick={() => handleChangeItem("answer-client")}
        />
        <AsideItem
          title="Company"
          icon={<Factory size={20} />}
          link="company"
          active={active === "company"}
          onClick={() => handleChangeItem("company")}
        ></AsideItem>
        
        <AsideItem
          title="Logout"
          icon={<X size={20} />}
          link="/"
          active={active === "logout"}
          onClick={() => handleLogout()}
          isLogout={true}
        ></AsideItem>
      </div>
    </React.Fragment>
  );
}
