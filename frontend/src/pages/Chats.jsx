import axios from "axios";
import { useEffect, useState, useCallback, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faSearch,
  faUserPlus,
  faUsers,
  faSmile,
  faPaperclip,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";
import { Tooltip } from "react-tooltip";
import { ChatContext } from "../Context/ChatProvider";
import { io } from "socket.io-client";
import SearchContacts from "../components/SearchContacts";
import GroupManagement from "../components/GroupManagement";
import NotificationBell from "../components/NotificationBell";
import EmojiPicker from "../components/EmojiPicker";
import FileUpload from "../components/FileUpload";
import PropTypes from "prop-types";

const Chats = () => {
  const { user, setUser } = useContext(ChatContext) || {};
  const navigate = useNavigate();
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
  const [showSearchContacts, setShowSearchContacts] = useState(false);
  const [showGroupManagement, setShowGroupManagement] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    if (socket) {
      socket.disconnect();
    }
    navigate("/");
  };

  const handleContactSelect = (chat) => {
    setSelectedChat(chat);
    fetchMessages(chat._id);
    fetchChats(); // Refresh the chats list
  };

  const handleGroupCreated = (group) => {
    setSelectedChat(group);
    fetchMessages(group._id);
    fetchChats(); // Refresh the chats list
  };

  const handleGroupUpdated = (group) => {
    setSelectedChat(group);
    fetchChats(); // Refresh the chats list
  };

  const handleClearNotification = (index) => {
    setNotifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNotificationClick = (notification) => {
    // Find the chat from the notification
    const chat = chats.find((c) => c._id === notification.chatId);
    if (chat) {
      setSelectedChat(chat);
      fetchMessages(chat._id);
    }
    // Remove the notification
    setNotifications((prev) =>
      prev.filter((n) => n.message._id !== notification.message._id)
    );
  };

  const handleEmojiSelect = (emoji) => {
    setNewMessage((prev) => prev + emoji);
  };

  // Helper function to get chat name and profile picture for non-group chats
  const getChatInfo = (chat) => {
    if (chat.groupChat) {
      return {
        name: chat.name,
        pic: null, // Groups don't have profile pictures
      };
    } else {
      // For one-to-one chats, find the other user
      const otherUser = chat.users.find((u) => u._id !== user._id);
      return {
        name: otherUser ? otherUser.name : "Unknown User",
        pic: otherUser ? otherUser.pic : null,
      };
    }
  };

  const handleFileUpload = async (fileInfo, messageType) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/message/`,
        {
          content: fileInfo.fileName,
          chatId: selectedChat._id,
          messageType: messageType,
          attachment: fileInfo,
        },
        getHeader()
      );
      setMessages((prev) => {
        if (prev.some((m) => m._id === data._id)) return prev;
        return [...prev, data];
      });
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
    if (user) {
      fetchChats();
    }
  }, [user]);

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
    if (user) {
      console.log("Setting up socket connection for user:", user._id);
      const newSocket = io(import.meta.env.VITE_BACKEND_URL);

      newSocket.on("connect", () => {
        console.log("Socket connected with ID:", newSocket.id);
        console.log("Emitting setup with user:", user);
        newSocket.emit("setup", user);
      });

      newSocket.on("connected", () => {
        console.log("Received connected confirmation from server");
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      setSocket(newSocket);

      return () => {
        console.log("Cleaning up socket connection");
        newSocket.close();
      };
    } else {
      console.log("No user available for socket connection");
    }
  }, [user]);

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

  // Fetch notifications on login
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) return;
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/notification`,
          getHeader()
        );
        console.log("Fetched notifications:", data);
        setNotifications(data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [user]);

  // Listen for notification events
  useEffect(() => {
    if (!socket) {
      console.log("No socket connection for notifications");
      return;
    }

    const handleNotification = (data) => {
      try {
        console.log("Received notification data:", data);

        if (!data || !data.message) {
          console.error("Invalid notification format:", data);
          return;
        }

        // Only add notification if not in the current chat
        if (!selectedChat || selectedChat._id !== data.chatId) {
          console.log("Adding new notification");
          setNotifications((prev) => {
            if (prev.some((n) => n._id === data._id)) {
              console.log("Duplicate notification - skipping");
              return prev;
            }
            // Play notification sound
            new Audio("/notification.mp3").play().catch(console.error);
            return [data, ...prev];
          });
        } else {
          console.log(
            "Skipping notification - user is in the chat:",
            data.chatId
          );
        }
      } catch (error) {
        console.error("Error handling notification:", error);
      }
    };

    console.log("Setting up notification listener");
    socket.on("notification", handleNotification);

    return () => {
      console.log("Cleaning up notification listener");
      socket.off("notification", handleNotification);
    };
  }, [socket, selectedChat]);

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

  // Socket setup is now handled in the socket creation useEffect

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showMenu && !event.target.closest(".user-menu")) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showMenu]);

  // Add DefaultAvatar component
  const DefaultAvatar = ({ name, bgColor = "bg-brightMagenta" }) => (
    <div
      className={`w-10 h-10 rounded-full ${bgColor} flex items-center border-2 border-black justify-center text-black font-semibold`}
    >
      {name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "?"}
    </div>
  );

  DefaultAvatar.propTypes = {
    name: PropTypes.string,
    bgColor: PropTypes.string,
  };

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
          <div className="relative user-menu" data-tooltip-id="user-tooltip">
            <div
              onClick={() => setShowMenu(!showMenu)}
              className="relative w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden cursor-pointer"
              data-tooltip-id="user-tooltip"
            >
              {user?.pic ? (
                <img
                  src={user.pic}
                  alt="User Avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-brightMagenta flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            {showMenu && (
              <div className="fixed left-10 top-14 w-40 bg-white rounded-lg shadow-lg p-2 z-50">
                <button
                  className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-200"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
          <Tooltip id="user-tooltip" place="top" effect="solid" offset={1}>
            {user?.name || "Guest"}
          </Tooltip>
          <FontAwesomeIcon
            icon={faUserPlus}
            className="text-3xl text-white cursor-pointer hover:text-brightMagenta transition-colors"
            onClick={() => setShowSearchContacts(true)}
            data-tooltip-id="add-contact-tooltip"
          />
          <Tooltip id="add-contact-tooltip" place="right" effect="solid">
            Add Contact
          </Tooltip>
          <FontAwesomeIcon
            icon={faUsers}
            className="text-3xl text-white cursor-pointer hover:text-brightMagenta transition-colors"
            onClick={() => setShowGroupManagement(true)}
            data-tooltip-id="group-management-tooltip"
          />
          <Tooltip id="group-management-tooltip" place="right" effect="solid">
            {selectedChat && selectedChat.groupChat
              ? "Manage Group"
              : "Create Group"}
          </Tooltip>
          <NotificationBell
            notifications={notifications}
            onClearNotification={handleClearNotification}
            onNotificationClick={handleNotificationClick}
          />
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
                    (n) => n.message.chat._id === chat._id && !n.isRead
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
                        <DefaultAvatar
                          name={chat.name}
                          bgColor="bg-white text-black"
                        />
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
                        {chatNotifications.length > 0 && (
                          <div className="w-5 h-5 rounded-full flex justify-center items-center bg-darkViolet text-white">
                            <p className="text-xs">
                              {chatNotifications.length}
                            </p>
                          </div>
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
                  const chatInfo = getChatInfo(chat);
                  const chatNotifications = notifications.filter(
                    (n) => n.message.chat._id === chat._id && !n.isRead
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
                        {chatInfo.pic ? (
                          <img
                            src={chatInfo.pic}
                            alt={chatInfo.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <DefaultAvatar name={chatInfo.name} />
                        )}
                        <div className="flex flex-col">
                          <p className="font-semibold text-deepMagenta">
                            {chatInfo.name}
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
                        {chatNotifications.length > 0 && (
                          <div className="w-5 h-5 rounded-full flex justify-center items-center bg-darkViolet text-white">
                            <p className="text-xs">
                              {chatNotifications.length}
                            </p>
                          </div>
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
            {/* WhatsApp-like header */}
            {selectedChat && (
              <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center space-x-3">
                  {/* Profile picture */}
                  {selectedChat.groupChat ? (
                    <DefaultAvatar
                      name={selectedChat.name}
                      bgColor="bg-white text-black"
                    />
                  ) : (
                    (() => {
                      const chatInfo = getChatInfo(selectedChat);
                      return chatInfo.pic ? (
                        <img
                          src={chatInfo.pic}
                          alt={chatInfo.name}
                          className="w-10 h-10 rounded-full object-cover border-2 border-black"
                        />
                      ) : (
                        <DefaultAvatar
                          name={chatInfo.name}
                          bgColor="bg-white text-black"
                        />
                      );
                    })()
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {selectedChat.groupChat
                        ? selectedChat.name
                        : getChatInfo(selectedChat).name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {selectedChat.groupChat
                        ? `${selectedChat.users.length} members`
                        : "Online"}
                    </p>
                  </div>
                </div>
              </div>
            )}
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
                        <div className="mb-1">
                          {msg.messageType === "image" && msg.attachment ? (
                            <div>
                              <img
                                src={`${import.meta.env.VITE_BACKEND_URL}${
                                  msg.attachment.url
                                }`}
                                alt={msg.attachment.fileName}
                                className="max-w-xs rounded-lg cursor-pointer"
                                onClick={() =>
                                  window.open(
                                    `${import.meta.env.VITE_BACKEND_URL}${
                                      msg.attachment.url
                                    }`,
                                    "_blank"
                                  )
                                }
                              />
                              <div className="text-xs text-gray-500 mt-1">
                                {msg.attachment.fileName}
                              </div>
                            </div>
                          ) : msg.messageType === "file" && msg.attachment ? (
                            <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg">
                              <FontAwesomeIcon
                                icon={faFile}
                                className="text-brightMagenta"
                              />
                              <div className="flex-1">
                                <div className="text-sm font-medium">
                                  {msg.attachment.fileName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {(
                                    msg.attachment.fileSize /
                                    1024 /
                                    1024
                                  ).toFixed(2)}{" "}
                                  MB
                                </div>
                              </div>
                              <a
                                href={`${import.meta.env.VITE_BACKEND_URL}${
                                  msg.attachment.url
                                }`}
                                download={msg.attachment.fileName}
                                className="text-brightMagenta hover:text-deepMagenta text-sm"
                              >
                                Download
                              </a>
                            </div>
                          ) : (
                            msg.content
                          )}
                        </div>
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
              <div className="relative">
                <form
                  onSubmit={sendMessage}
                  className="w-full border-t border-gray-300 flex items-center p-4 bg-white"
                  style={{ marginBottom: 0 }}
                >
                  <div className="flex gap-3 mr-2" style={{ minWidth: "60px" }}>
                    <button
                      type="button"
                      onClick={() => setShowFileUpload(!showFileUpload)}
                      className="text-brightMagenta hover:text-deepMagenta mr-4 text-xl"
                    >
                      <FontAwesomeIcon icon={faPaperclip} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="text-brightMagenta hover:text-deepMagenta ml-4 text-xl"
                    >
                      <FontAwesomeIcon icon={faSmile} />
                    </button>
                  </div>

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
                <EmojiPicker
                  isOpen={showEmojiPicker}
                  onClose={() => setShowEmojiPicker(false)}
                  onEmojiSelect={handleEmojiSelect}
                />
                <FileUpload
                  isOpen={showFileUpload}
                  onClose={() => setShowFileUpload(false)}
                  onFileUpload={handleFileUpload}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <SearchContacts
        isOpen={showSearchContacts}
        onClose={() => setShowSearchContacts(false)}
        onContactSelect={handleContactSelect}
      />
      <GroupManagement
        isOpen={showGroupManagement}
        onClose={() => setShowGroupManagement(false)}
        onGroupCreated={handleGroupCreated}
        onGroupUpdated={handleGroupUpdated}
        selectedChat={selectedChat}
      />
    </div>
  );
};

export default Chats;
