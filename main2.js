// Globals
let peer;
let connArr = [];
const sendMsg = document.querySelector("#send-msg");

// INITIATOR: You initiate the connection: Connect() process flow if you click the connect to initiate the connection request
const initiateConnectionRequest = async () => {
  // Get the partner peerId
  let partnerId = document.querySelector("#input-partner-id").value;
  document.querySelector("#input-partner-id").value = "";

  // Create the conn
  let conn = peer.connect(partnerId);
  connArr.push(conn);
  displayMsg(`Initiating connection`, partnerId, true);

  // Wait for the conn to open and add it to the dropdown
  await connOpen(conn);
  displayMsg(`Success! Connection Id= ${conn.connectionId}`, partnerId, true);
  addToDropdown(conn);

  // Keep this event listener open, will receive data multiple times
  conn.on("data", (data) => {
    displayMsg(`${data}`, partnerId, false);
    console.log(data);
  });

  conn.on("close", () => {
    displayMsg(`${partnerId} left the chat`, partnerId, false);
    closeConn(conn);
    conn = "";
  });

  conn.on("error", (err) => {
    displayMsg(`Error ${err.type}`, partnerId, false);
    closeConn(conn);
    conn = "";
  });

  // Event listener tied to this conn
  sendMsg.addEventListener("click", () => sendMessage(conn));
};

// RECEIVER: You received the request and connected: peer.on('connection') process flow if you are the receiver of the connection requrest
const receiveConnectionRequest = async (conn) => {
  // Keep this event listener open, can have multiple connections
  // peer.on("connection", async (conn) => {
  displayMsg(`Accepted connection request, connection id = ${conn.connectionId}`, conn.peer, false);

  // Wait for the connection to open and then add the connection to the dropdown list
  await connOpen(conn);
  addToDropdown(conn);

  // Keep this event listener open, will receive data multiple times
  conn.on("data", (data) => {
    displayMsg(`${data}`, conn.peer, false);
  });

  conn.on("close", () => {
    displayMsg(`${conn.peer} left the chat`, conn.peer, false);
    closeConn(conn);
    conn = "";
  });

  conn.on("error", (err) => {
    displayMsg(`Error ${err.type}`, conn.peer, false);
    closeConn(conn);
    conn = "";
  });

  // Event listener tied to this conn
  sendMsg.addEventListener("click", (evt) => sendMessage(conn));
  // });
};

// Main flow
const load = async () => {
  // First create your peer object

  createPeer();

  await waitForPeer();

  // Set event listeners for others connecting with you (receiveConnectionRequestion)
  // receiveConnectionRequest();
  peer.on("connection", async (conn) => receiveConnectionRequest);

  // or if you try to connect with others (click to initiateConnectionRequest)
  document.querySelector("#connect-partner-id").addEventListener("click", initiateConnectionRequest);
};

window.onload = load;
