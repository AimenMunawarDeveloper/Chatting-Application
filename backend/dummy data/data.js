const chats = [
  {
    isGroupChat: false,
    users: [
      {
        name: "Ali Khan",
        email: "ali.khan@example.com",
      },
      {
        name: "Sara Ahmed",
        email: "sara.ahmed@example.com",
      },
    ],
    _id: "617a077e18c25468bc7c4dd4",
    chatName: "Ali Khan",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Ayesha Siddiqui",
        email: "ayesha.siddiqui@example.com",
      },
      {
        name: "Sara Ahmed",
        email: "sara.ahmed@example.com",
      },
    ],
    _id: "617a077e18c25468b27c4dd4",
    chatName: "Ayesha Siddiqui",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Zain Malik",
        email: "zain.malik@example.com",
      },
      {
        name: "Sara Ahmed",
        email: "sara.ahmed@example.com",
      },
    ],
    _id: "617a077e18c2d468bc7c4dd4",
    chatName: "Zain Malik",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Ali Khan",
        email: "ali.khan@example.com",
      },
      {
        name: "Sara Ahmed",
        email: "sara.ahmed@example.com",
      },
      {
        name: "Ayesha Siddiqui",
        email: "ayesha.siddiqui@example.com",
      },
    ],
    _id: "617a518c4081150716472c78",
    chatName: "Family Group",
    groupAdmin: {
      name: "Ayesha Siddiqui",
      email: "ayesha.siddiqui@example.com",
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Hina Rashid",
        email: "hina.rashid@example.com",
      },
      {
        name: "Sara Ahmed",
        email: "sara.ahmed@example.com",
      },
    ],
    _id: "617a077e18c25468bc7cfdd4",
    chatName: "Hina Rashid",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "Ali Khan",
        email: "ali.khan@example.com",
      },
      {
        name: "Sara Ahmed",
        email: "sara.ahmed@example.com",
      },
      {
        name: "Ayesha Siddiqui",
        email: "ayesha.siddiqui@example.com",
      },
    ],
    _id: "617a518c4081150016472c78",
    chatName: "Friends Hangout",
    groupAdmin: {
      name: "Ayesha Siddiqui",
      email: "ayesha.siddiqui@example.com",
    },
  },
];
module.exports = { chats };
