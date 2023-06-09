export const isSameSenderMargin = (messages, m, i, loggedUser) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== loggedUser._id
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== loggedUser._id) ||
    (i === messages.length - 1 && messages[i].sender._id !== loggedUser._id)
  )
    return 0;
  else return "auto";
};

export const isSameSender = (messages, m, i, loggedUser) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== loggedUser._id
  );
};

export const isLastMessage = (messages, i, loggedUser) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== loggedUser._id &&
    messages[messages.length - 1].sender._id
  );
};

export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

export const getSenderName = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1].name : users[0].name;
};

export const getSenderId = (loggedUser, users) => {
  return users[0]?._id === loggedUser?._id ? users[1]._id : users[0]._id;
};
