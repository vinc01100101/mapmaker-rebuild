const userTextContent = document.querySelector("#user").textContent;

const userData = userTextContent != "" && JSON.parse(userTextContent);

module.exports = { userData };
