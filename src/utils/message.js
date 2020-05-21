//for reduce the duplicate code create septate file for message and⏲
const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

//for location messages
const generateLocationMessage = (url) => {
  return {
    url,
    createdAt: new Date().getTime(),
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage,
};
