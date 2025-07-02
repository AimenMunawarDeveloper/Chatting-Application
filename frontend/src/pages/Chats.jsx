import axios from "axios";
import { useEffect, useState, useCallback, useContext, useRef } from "react";
import on from "../assets/on.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faComment,
  faCheckDouble,
  faSearch,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Tooltip } from "react-tooltip";
import { ChatContext } from "../Context/ChatProvider";
import { io } from "socket.io-client";

const Chats = () => {
  const { user } = useContext(ChatContext) || {};
  const [showMenu, setShowMenu] = useState(false);
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [nonGroupChats, setNonGroupChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const [socket, setSocket] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
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
      setNonGroupChats(data.filter((chat) => !chat.groupChat));
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    console.log(chats);
  }, [chats]);
  const formatDate = (date) => {
    const newDate = new Date(date);
    const formattedDate = newDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return formattedDate;
  };

  // Fetch messages for selected chat
  const fetchMessages = async (chatId) => {
    if (!chatId) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/${chatId}`,
        getHeader()
      );
      setMessages(data);
      setLoading(false);
      // Scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // Handle chat selection
  const handleChatSelect = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
  };

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BACKEND_URL);
    newSocket.on("connect", () => console.log("Socket connected!"));
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && selectedChat) {
      socket.emit("join chat", selectedChat._id);
    }
  }, [socket, selectedChat]);

  useEffect(() => {
    if (!socket) return;
    const handleMessageReceived = (message) => {
      if (selectedChat && message.chat._id === selectedChat._id) {
        setMessages((prev) => {
          if (prev.some((m) => m._id === message._id)) return prev;
          return [...prev, message];
        });
      }
    };
    socket.on("message received", handleMessageReceived);
    return () => {
      socket.off("message received", handleMessageReceived);
    };
  }, [socket, selectedChat]);

  // Listen for notification events
  useEffect(() => {
    if (!socket) return;
    const handleNotification = (data) => {
      console.log("Received notification:", data);
      setNotifications((prev) => {
        if (prev.some((n) => n.message._id === data.message._id)) return prev;
        return [...prev, data];
      });
    };
    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  // Mark notifications as read when opening a chat
  useEffect(() => {
    if (!selectedChat) return;
    if (notifications.some((n) => n.chatId === selectedChat._id)) {
      // Remove notifications for this chat
      setNotifications((prev) =>
        prev.filter((n) => n.chatId !== selectedChat._id)
      );
      // Optionally, call backend to mark as read
      axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/notification/read`,
        { chatId: selectedChat._id },
        getHeader()
      );
    }
  }, [selectedChat]);

  // Filtered chats for search
  const filteredGroupChats = groupChats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      (chat.latestMessage &&
        chat.latestMessage.content.toLowerCase().includes(search.toLowerCase()))
  );
  const filteredNonGroupChats = nonGroupChats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(search.toLowerCase()) ||
      (chat.latestMessage &&
        chat.latestMessage.content.toLowerCase().includes(search.toLowerCase()))
  );

  // Update sendMessage to emit socket event
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/`,
        { content: newMessage, chatId: selectedChat._id },
        getHeader()
      );
      setMessages((prev) => {
        if (prev.some((m) => m._id === data._id)) return prev;
        return [...prev, data];
      });
      setNewMessage("");
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      if (socket) {
        socket.emit("new message", data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log("Notifications:", notifications);

  useEffect(() => {
    if (socket && user) {
      socket.emit("setup", user);
    }
  }, [socket, user]);

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
          <form
            className="w-full p-0 relative"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="flex items-center bg-white rounded-lg border-2 border-brightMagenta focus-within:border-deepMagenta p-2">
              <FontAwesomeIcon icon={faSearch} className="text-black ml-2" />
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search"
                className="w-full bg-transparent outline-none p-2 pl-3"
                data-tooltip-id="search-tooltip"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Tooltip id="search-tooltip" place="bottom" effect="solid">
              Search users to chat
            </Tooltip>
          </form>
          <div className="rounded-lg bg-white p-3 shadow-lg">
            <h2 className="font-semibold text-lg text-richPurple">Groups</h2>
            {filteredGroupChats.length > 0
              ? filteredGroupChats.map((chat) => {
                  const chatNotifications = notifications.filter(
                    (n) => n.message.chat._id === chat._id
                  );
                  return (
                    <div
                      key={chat._id}
                      className={`mt-3 flex justify-between w-full gap-3 cursor-pointer ${
                        selectedChat?._id === chat._id
                          ? "bg-brightMagenta/10"
                          : ""
                      }`}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="flex gap-5">
                        <img src={on} className="w-10" />
                        <div className="flex flex-col">
                          <p className="font-semibold text-deepMagenta">
                            {chat.name}
                          </p>
                          <p className="text-darkViolet">
                            {chat.latestMessage
                              ? chat.latestMessage.content
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-gray-600">
                          {chat.latestMessage
                            ? formatDate(chat.latestMessage.createdAt)
                            : ""}
                        </p>
                        {chatNotifications.length > 0 ? (
                          <div className="w-5 h-5 rounded-full flex justify-center items-center bg-darkViolet text-white">
                            <p className="text-xs">
                              {chatNotifications.length}
                            </p>
                          </div>
                        ) : (
                          <FontAwesomeIcon
                            icon={faCheckDouble}
                            className="text-brightMagenta"
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              : "No Group chats"}
          </div>
          <div className="rounded-lg bg-white p-3 shadow-lg">
            <h2 className="font-semibold text-lg text-richPurple">People</h2>
            {filteredNonGroupChats.length > 0
              ? filteredNonGroupChats.map((chat) => {
                  const chatNotifications = notifications.filter(
                    (n) => n.message.chat._id === chat._id
                  );
                  return (
                    <div
                      key={chat._id}
                      className={`mt-3 flex justify-between w-full gap-3 cursor-pointer ${
                        selectedChat?._id === chat._id
                          ? "bg-brightMagenta/10"
                          : ""
                      }`}
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="flex gap-5">
                        <img src={on} className="w-10" />
                        <div className="flex flex-col">
                          <p className="font-semibold text-deepMagenta">
                            {chat.name}
                          </p>
                          <p className="text-darkViolet">
                            {chat.latestMessage
                              ? chat.latestMessage.content
                              : ""}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-gray-600">
                          {chat.latestMessage
                            ? formatDate(chat.latestMessage.createdAt)
                            : ""}
                        </p>
                        {chatNotifications.length > 0 ? (
                          <div className="w-5 h-5 rounded-full flex justify-center items-center bg-darkViolet text-white">
                            <p className="text-xs">
                              {chatNotifications.length}
                            </p>
                          </div>
                        ) : (
                          <FontAwesomeIcon
                            icon={faCheckDouble}
                            className="text-brightMagenta"
                          />
                        )}
                      </div>
                    </div>
                  );
                })
              : "No Chats Available"}
          </div>
        </div>
        <div className="lg:w-1/4 sm:w-full flex flex-col gap-4 p-0 lg:flex-grow mt-5">
          <div className="bg-white h-full mx-5 mb-5 rounded-lg flex flex-col flex-grow">
            {/* Message display area */}
            <div className="flex-1 overflow-auto p-4">
              {selectedChat ? (
                loading ? (
                  <div>Loading messages...</div>
                ) : messages.length > 0 ? (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`mb-2 flex ${
                        msg.sender._id === user._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg px-4 py-3 ${
                          msg.sender._id === user._id
                            ? "bg-richPurple text-nearBlack"
                            : "bg-darkViolet/20 text-darkViolet"
                        }`}
                        style={{ maxWidth: "70%" }}
                      >
                        <div className="text-xs font-semibold mb-1">
                          {msg.sender.name}
                        </div>
                        <div className="mb-1">{msg.content}</div>
                        <div className="text-[10px] text-right">
                          {formatDate(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div>No messages yet.</div>
                )
              ) : (
                <div className="text-center text-gray-400">
                  Select a chat to view messages
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            {/* Message input */}
            {selectedChat && (
              <form
                onSubmit={sendMessage}
                className="w-full border-t border-gray-300 flex items-center p-4 bg-white"
                style={{ marginBottom: 0 }}
              >
                <input
                  type="text"
                  placeholder="Type Your Message"
                  className="flex-grow h-12 px-4 rounded-md border border-brightMagenta focus:border-deepMagenta outline-none text-black mr-4"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-brightMagenta text-white rounded-md hover:bg-deepMagenta transition text-base font-semibold"
                  disabled={!newMessage.trim()}
                  style={{ minWidth: "80px" }}
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chats;
