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
  displayMsg(`Sending connection request to ${partnerId}`, "", true);

  // Wait for the conn to open and add it to the dropdown
  let boolReceiver = false;
  await connOpen(conn, boolReceiver);

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
  // Wait for the connection to open and then add the connection to the dropdown list
  debugger;
  let boolReceiver = true;
  await connOpen(conn, boolReceiver);
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
    displayMsg(`${err}`, conn.peer, false);
    closeConn(conn);
    conn = "";
  });

  // Event listener tied to this conn
  sendMsg.addEventListener("click", (evt) => sendMessage(conn));
};

// Main flow
const load = async () => {
  // First create your peer object

  createPeer();

  await waitForPeer();

  // Set event listeners for receiving connection request
  peer.on("connection", receiveConnectionRequest);

  // Set event listeners to create connection request
  document.querySelector("#connect-partner-id").addEventListener("click", initiateConnectionRequest);
};

window.onload = load;
