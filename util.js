// peer = new Peer(null, {
//     host: 'videodesk-ennesimo.herokuapp.com',
//     port: 443,
//     secure: true
// });

const createPeer = () => {
  // Use Id if entered

  document.querySelector("#get-peer-id").addEventListener("click", async (evt) => {
    let id = document.querySelector("#choose-peer-id").value;
    id = id.trim();

    id = id == "" ? null : id;

    // Get your peer object
    peer = new Peer(id, {
      host: "evening-atoll-16293.herokuapp.com",
      port: 443,
      secure: true,
    });

    // Wait for peer object to open
    peerId = await getPeerId(peer);
    document.querySelector("#headline").innerText = `${peerId} private chat`;

    // Keep this event listener for testing purposes
    peer.on("error", (err) => alert(`Error type: ${err.type}`));

    // log your id
    document.querySelector("#my-id").innerText = `My Chat Id: ${peerId}`;
  });
};

const waitForPeer = () => {
  return new Promise((resolve, reject) => {
    setInterval(() => {
      if (peer?.id) {
        resolve();
      }
    }, 200);
  });
};

const getPeerId = (peer) => {
  return new Promise((resolve, reject) => {
    peer.on("open", (id) => resolve(id));
  });
};

const getPeerConn = (peer) => {
  return new Promise((resolve, reject) => {
    peer.on("connection", (conn) => resolve(conn));
  });
};

const connOpen = (conn, boolReceiver = false) => {
  return new Promise((resolve, reject) => {
    conn.on("open", () => {
      if (boolReceiver) {
        // displayMsg(`Received connection request from ${conn.peer}`, "", false);
        displayMsg(`Accepted request from ${conn.peer}, conn id = ${conn.connectionId}`, "", true);
      } else {
        displayMsg(`Connected with ${conn.peer},  conn Id= ${conn.connectionId}`, "", true);
      }
      resolve();
    });
  });
};

const closeConn = (conn) => {
  // Remove conn peer from array
  connArr = connArr.filter((el) => el.peer != conn.peer);

  // Update dropdown
  let ul = document.querySelector("#ul-dropdown");
  ul.innerHTML = `<li><a class="dropdown-item" href="#" data-id="All">All</a></li>`;

  // Rebuild list from updated array
  for (let i = 0; i < connArr.length; i++) {
    let id = connArr[i];
    ul.innerHTML += `<li><a class="dropdown-item" href="#" data-id="${id}">${id}</a></li>`;
  }

  // If empty then put back the "Choose Receiver"
  if (connArr.length < 1) {
    document.querySelector("#btn-dropdown").innerText = "Choose receiver";
  }

  // Close and remove
  conn.close();
};

// Send message
const sendMessage = (conn) => {
  // Send the message if you selected id on dropdown list
  // sendReceivers is an array that is built at the time of dropdown selection
  // normally it should be of size 1 the selected single id, but can also be all
  if (sendReceivers.includes(conn.peer)) {
    msg = document.querySelector("#input-msg").value;
    displayMsg(`${msg}`, conn.peer, true);
    conn.send(msg);
  }

  // If you are the last one on the list then clear out the field and set focus
  let list = [...document.querySelector("#ul-dropdown").querySelectorAll("a")].map((el) => el.dataset.id);

  if (conn.peer == list[list.length - 1]) {
    console.log(`last item`);
    document.querySelector("#input-msg").value = "";
    document.querySelector("#input-msg").focus();
  }
};

// Timestamp
const getMyDateStamp = (date) => {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var dateString = hours + ":" + minutes + " " + ampm;
  return dateString;
};

// Not used
const receiveConnectionRequest_old = () => {
  // Keep this event listener open, can have multiple connections
  peer.on("connection", async (conn) => {
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
  });
};
