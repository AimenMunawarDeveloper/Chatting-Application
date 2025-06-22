import axios from "axios";
import { useEffect, useState, useCallback, useContext } from "react";
import on from "../assets/on.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faComment,
  faCheckDouble,
  faSearch,
  faUser,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Tooltip } from "react-tooltip";
import { ChatContext } from "../Context/ChatProvider";
const Chats = () => {
  const { user } = useContext(ChatContext) || {};
  const [showMenu, setShowMenu] = useState(false);
  // console.log(user.name);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loadingChat, setLoadingChat] = useState();
  const [chats, setChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  // console.log(user);
  // const fetchChats = async () => {
  //   const response = await axios.get(
  //     ${import.meta.env.VITE_BACKEND_URL}/api/chat
  //   );
  //   setChats(response.data);
  // };
  // useEffect(() => {
  //   fetchChats();
  // }, []);
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);
  const getHeader = () => {
    const { email, name, pic, token, _id } = JSON.parse(
      localStorage.getItem("userInfo")
    );
    console.log(email, name, pic, token, _id);
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };
  useEffect(() => {
    console.log("Updated User:", user);
    fetchChats();
  }, []);

  const fetchChats = async () => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/fetch`,
        getHeader()
      );
      setChats(data);
      setGroupChats(data.filter((chat) => chat.groupChat));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log(chats);
  }, [chats]);
  return (
    <div className="h-screen flex flex-col bg-gradient-to-r from-brightMagenta via-deepMagenta via-richPurple via-darkViolet to-nearBlack bg-[length:200%_200%] animate-gradientMove p-2">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          background: {
            color: "transparent",
          },
          particles: {
            number: {
              value: 100,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            move: {
              enable: true,
              speed: 2,
            },
            size: {
              value: 2,
            },
            color: {
              value: "#ffffff",
            },
            shape: {
              type: "line",
            },
            links: {
              enable: true,
              color: "#ffffff",
              distance: 150,
              opacity: 0.5,
              width: 1,
            },
          },
        }}
      />
      <div className="h-full lg:flex gap-6 flex-grow">
        <div className="flex lg:flex-col lg:w-16 sm:w-full sm:flex sm:flex-row justify-center gap-10 p-2 bg-nearBlack shadow-2xl rounded-lg lg:h-full overflow-auto  items-center">
          <div className="relative" data-tooltip-id="user-tooltip">
            <div
              onClick={() => setShowMenu(!showMenu)}
              className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden"
              data-tooltip-id="user-tooltip"
            >
              {user?.pic ? (
                <img
                  src={user.pic}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg font-bold text-deepMagenta">
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </span>
              )}
            </div>
            {showMenu && (
              <div className="fixed left-10 top-14 w-40 bg-white rounded-lg shadow-lg p-2 z-50">
                <button className="w-full text-left px-4 py-2 text-darkViolet hover:bg-gray-200">
                  My Profile
                </button>
                <button className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200">
                  Log Out
                </button>
              </div>
            )}
          </div>
          <Tooltip id="user-tooltip" place="top" effect="solid" offset={1}>
            {user?.name || "Guest"}
          </Tooltip>
          <FontAwesomeIcon icon={faHouse} className="text-3xl text-white" />
          <FontAwesomeIcon icon={faComment} className="text-3xl text-white" />
          <FontAwesomeIcon icon={faBell} className="text-3xl text-white" />
        </div>
        <div className="lg:w-1/2 sm:w-full flex flex-col gap-4 p-0 mt-5">
          <form className="w-full p-0 relative">
            <div className="flex items-center bg-white rounded-lg border-2 border-brightMagenta focus-within:border-deepMagenta p-2">
              <FontAwesomeIcon icon={faSearch} className="text-black ml-2" />
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search"
                className="w-full bg-transparent outline-none p-2 pl-3"
                data-tooltip-id="search-tooltip"
              />
            </div>
            <Tooltip id="search-tooltip" place="bottom" effect="solid">
              Search users to chat
            </Tooltip>
          </form>
          <div className="rounded-lg bg-white p-3 shadow-lg">
            <h2 className="font-semibold text-lg text-richPurple">Groups</h2>
            {groupChats.length > 0
              ? groupChats.map((chat) => {
                  return (
                    <div
                      key={chat._id}
                      className="mt-3 flex justify-between w-full gap-3"
                    >
                      <div className="flex gap-5">
                        <img src={on} className="w-10" />
                        <div className="flex flex-col">
                          <p className="font-semibold text-deepMagenta">
                            {chat.name}
                          </p>
                          <p className="text-darkViolet">Last message here</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-gray-600">Today, 9:52pm</p>
                        <div className="w-5 h-5 rounded-full flex justify-center items-center bg-darkViolet text-white">
                          <p className="text-xs">4</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              : "No Group chats"}
          </div>
          <div className="rounded-lg bg-white p-3 shadow-lg">
            <h2 className="font-semibold text-lg text-richPurple">People</h2>
            <div className="mt-3 flex justify-between w-full gap-3">
              <div className="flex gap-5">
                <img src={on} className="w-10" />
                <div className="flex flex-col">
                  <p className="font-semibold text-deepMagenta">
                    Aimen Munawar
                  </p>
                  <p className="text-darkViolet">Haha how are you</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-gray-600">Today, 9:52pm</p>
                <FontAwesomeIcon
                  icon={faCheckDouble}
                  className="text-brightMagenta"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-1/4 sm:w-full flex flex-col gap-4 p-0 lg:flex-grow mt-5">
          {/* <h2 className="font-semibold text-xl text-white">Chats</h2> */}
          {/* {chats.map((chat) => (
            <div key={chat._id} className="rounded-lg bg-white p-3 shadow-lg">
              <h3 className="text-deepMagenta">{chat.chatName}</h3>
            </div>
          ))} */}
          <div className="bg-white h-full mx-5 mb-5 rounded-lg"></div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
