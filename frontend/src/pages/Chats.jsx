import axios from "axios";
import { useEffect, useState } from "react";
import on from "../assets/on.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faComment,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";

const Chats = () => {
  const [chats, setChats] = useState([]);

  const fetchChats = async () => {
    const response = await axios.get("http://localhost:5000/api/chat");
    setChats(response.data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="min-h-screen bg-violet-200 p-3">
      <div className="lg:flex lg:gap-0 lg:justify-between">
        <div className="flex flex-wrap lg:w-16 sm:w-full sm:flex sm:flex-row items-center p-2 bg-violet-600 rounded-lg">
          <img src={on} className="w-10" />
          <div className="mt-10 gap-5">
            <FontAwesomeIcon icon={faHouse} className="text-3xl text-white" />
            <FontAwesomeIcon icon={faComment} className="text-3xl text-white" />
          </div>
        </div>
        {/* Main Content Section */}
        <div className="lg:w-1/2 sm:w-full flex flex-col p-0">
          {" "}
          {/* Removed padding */}
          {/* Search Bar */}
          <form className="w-full p-0">
            {" "}
            {/* Removed padding */}
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search"
              className="w-full border-2 mb-0 border-violet-400 focus:border-violet-500 p-1 rounded-lg" // Removed margin-bottom
            />
          </form>
          {/* Groups Section */}
          <div className="rounded-lg bg-white p-3 mb-0 shadow-lg">
            {" "}
            {/* Removed margin-bottom */}
            <h2 className="font-semibold text-lg">Groups</h2>
            <div className="mt-3 flex justify-between w-full gap-3">
              <div className="flex gap-5">
                <img src={on} className="w-10" />
                <div className="flex flex-col">
                  <p className="font-semibold">Aimen Munawar</p>
                  <p>Haha how are you</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-gray-600">Today, 9:52pm</p>
                <div className="w-5 h-5 rounded-full flex justify-center items-center bg-orange-600 text-white">
                  <p className="text-xs">4</p>
                </div>
              </div>
            </div>
          </div>
          {/* People Section */}
          <div className="rounded-lg bg-white p-3 mb-0 shadow-lg">
            {" "}
            {/* Removed margin-bottom */}
            <h2 className="font-semibold text-lg">People</h2>
            <div className="mt-3 flex justify-between w-full gap-3">
              <div className="flex gap-5">
                <img src={on} className="w-10" />
                <div className="flex flex-col">
                  <p className="font-semibold">Aimen Munawar</p>
                  <p>Haha how are you</p>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <p className="text-gray-600">Today, 9:52pm</p>
                <FontAwesomeIcon
                  icon={faCheckDouble}
                  className="text-violet-600"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Chats Section */}
        <div className="lg:w-1/4 sm:w-full flex flex-col p-0 lg:flex-grow">
          {" "}
          {/* Removed padding */}
          <h2 className="font-semibold text-xl mb-3">Chats</h2>
          {chats.map((chat) => (
            <div key={chat._id}>
              <h3>{chat.chatName}</h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Chats;
