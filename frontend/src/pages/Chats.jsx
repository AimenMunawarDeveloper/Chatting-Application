import axios from "axios";
import { useEffect, useState } from "react";
import on from "../assets/on.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faComment,
  faCheckDouble,
  faUser,
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
    <div className="h-screen flex flex-col bg-gradient-to-r from-brightMagenta via-deepMagenta via-richPurple via-darkViolet to-nearBlack bg-[length:200%_200%] animate-gradientMove p-2">
      <div className="h-full lg:flex gap-6 flex-grow">
        <div className="flex lg:flex-col lg:w-16 sm:w-full sm:flex sm:flex-row justify-center gap-10 p-2 bg-nearBlack shadow-2xl rounded-lg lg:h-full overflow-auto">
          <FontAwesomeIcon icon={faUser} className="text-3xl text-white" />
          <FontAwesomeIcon icon={faHouse} className="text-3xl text-white" />
          <FontAwesomeIcon icon={faComment} className="text-3xl text-white" />
        </div>
        <div className="lg:w-1/2 sm:w-full flex flex-col gap-4 p-0 mt-5">
          <form className="w-full p-0">
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search"
              className="w-full border-2 border-brightMagenta focus:border-deepMagenta p-2 rounded-lg"
            />
          </form>
          <div className="rounded-lg bg-white p-3 shadow-lg">
            <h2 className="font-semibold text-lg text-richPurple">Groups</h2>
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
                <div className="w-5 h-5 rounded-full flex justify-center items-center bg-darkViolet text-white">
                  <p className="text-xs">4</p>
                </div>
              </div>
            </div>
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
