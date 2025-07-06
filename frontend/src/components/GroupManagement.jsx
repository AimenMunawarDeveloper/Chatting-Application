import { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  faTimes,
  faPlus,
  faEdit,
  faCheck,
  faUserPlus,
  faUserMinus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

const GroupManagement = ({
  isOpen,
  onClose,
  onGroupCreated,
  selectedChat,
  onGroupUpdated,
}) => {
  const [mode, setMode] = useState("create"); // create, rename, manage
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const getHeader = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
        "Content-Type": "application/json",
      },
    };
  };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setCurrentUser(userInfo);

    if (selectedChat && selectedChat.groupChat) {
      setMode("manage");
      setGroupName(selectedChat.name);
      setSelectedUsers(
        selectedChat.users.filter((u) => u._id !== userInfo._id)
      );
    } else {
      setMode("create");
      setGroupName("");
      setSelectedUsers([]);
    }
  }, [selectedChat, isOpen]);

  const searchUsers = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user?search=${query}`,
        getHeader()
      );
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    if (selectedUsers.find((u) => u._id === user._id)) {
      setSelectedUsers(selectedUsers.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length < 2) {
      toast.error(
        "Group name is required and at least 2 users must be selected",
        { theme: "dark" }
      );
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/group`,
        {
          name: groupName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        getHeader()
      );
      onGroupCreated(data);
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  const handleRenameGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Group name is required", { theme: "dark" });
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/rename`,
        {
          chatId: selectedChat._id,
          newName: groupName,
        },
        getHeader()
      );
      onGroupUpdated(data);
      toast.success("Group renamed successfully", { theme: "dark" });
    } catch (error) {
      console.error("Error renaming group:", error);
      toast.error("Failed to rename group", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  const handleAddUserToGroup = async (userId) => {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userId,
        },
        getHeader()
      );
      onGroupUpdated(data);
      setSelectedUsers(data.users.filter((u) => u._id !== currentUser._id));
    } catch (error) {
      console.error("Error adding user to group:", error);
      toast.error("Failed to add user to group", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveUserFromGroup = async (userId) => {
    setLoading(true);
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: userId,
        },
        getHeader()
      );
      onGroupUpdated(data);
      setSelectedUsers(data.users.filter((u) => u._id !== currentUser._id));
    } catch (error) {
      console.error("Error removing user from group:", error);
      toast.error("Failed to remove user from group", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setGroupName("");
    setSelectedUsers([]);
    setSearchTerm("");
    setSearchResults([]);
    setMode("create");
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      searchUsers(searchTerm);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  if (!isOpen) return null;

  const isUserSelected = (user) =>
    selectedUsers.find((u) => u._id === user._id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-deepMagenta">
            <FontAwesomeIcon icon={faUsers} className="mr-2" />
            {mode === "create"
              ? "Create Group"
              : mode === "rename"
              ? "Rename Group"
              : "Manage Group"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {mode === "manage" && (
          <div className="mb-4 flex space-x-2">
            <button
              onClick={() => setMode("rename")}
              className="bg-brightMagenta text-white px-3 py-1 rounded-md hover:bg-deepMagenta transition-colors"
            >
              <FontAwesomeIcon icon={faEdit} className="mr-1" />
              Rename
            </button>
            <button
              onClick={() => setMode("create")}
              className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-1" />
              Create New
            </button>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group Name
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brightMagenta"
            placeholder="Enter group name"
          />
        </div>

        {mode === "rename" && (
          <div className="flex space-x-2">
            <button
              onClick={handleRenameGroup}
              disabled={loading}
              className="bg-brightMagenta text-white px-4 py-2 rounded-lg hover:bg-deepMagenta transition-colors disabled:bg-gray-400"
            >
              <FontAwesomeIcon icon={faCheck} className="mr-1" />
              {loading ? "Renaming..." : "Rename Group"}
            </button>
            <button
              onClick={() => setMode("manage")}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        )}

        {(mode === "create" || mode === "manage") && (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Users
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brightMagenta"
                placeholder="Search users by name or email..."
              />
            </div>

            {mode === "manage" && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  Current Members
                </h3>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-brightMagenta flex items-center justify-center text-white font-semibold text-xs">
                          {user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <span className="text-sm font-medium">{user.name}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveUserFromGroup(user._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        <FontAwesomeIcon icon={faUserMinus} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-700 mb-2">
                  {mode === "create" ? "Add Users" : "Add New Members"}
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-brightMagenta flex items-center justify-center text-white font-semibold text-xs">
                          {user.name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{user.name}</div>
                          <div className="text-xs text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      {mode === "create" ? (
                        <button
                          onClick={() => handleUserSelect(user)}
                          className={`px-2 py-1 rounded-md text-sm ${
                            isUserSelected(user)
                              ? "bg-green-500 text-white"
                              : "bg-brightMagenta text-white hover:bg-deepMagenta"
                          }`}
                        >
                          {isUserSelected(user) ? "Selected" : "Select"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddUserToGroup(user._id)}
                          className="bg-brightMagenta text-white px-2 py-1 rounded-md hover:bg-deepMagenta transition-colors text-sm"
                        >
                          <FontAwesomeIcon icon={faUserPlus} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mode === "create" && (
              <div className="flex justify-end space-x-2">
                <button
                  onClick={onClose}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateGroup}
                  disabled={
                    loading || !groupName.trim() || selectedUsers.length < 2
                  }
                  className="bg-brightMagenta text-white px-4 py-2 rounded-lg hover:bg-deepMagenta transition-colors disabled:bg-gray-400"
                >
                  {loading ? "Creating..." : "Create Group"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </div>
  );
};

GroupManagement.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGroupCreated: PropTypes.func.isRequired,
  selectedChat: PropTypes.object,
  onGroupUpdated: PropTypes.func.isRequired,
};

export default GroupManagement;
