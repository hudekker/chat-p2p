(function () {
  let peer;
  let connArr = [];
  const msgHead = document.querySelector("#msg-head");
  const sendMsg = document.querySelector("#send-msg");

  const getMyDateStamp = date => {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var dateString = hours + ':' + minutes + ' ' + ampm;
    return dateString;
  }

  const displayMsg = (msg, partnerId, boolMe = true) => {
    let dateString = getMyDateStamp(new Date);
    let tagClassname = boolMe ? 'tag-me' : 'tag-you';
    let tagText = boolMe ? '' : '';
    // let tagText = boolMe ? 'To ' : 'From ';
    let bubble = boolMe ? 'msg-me d-inline-flex' : 'msg-you d-inline-flex';
    let flowDir = boolMe ? 'flex-row-reverse' : 'flex-row';
    // msgHead.innerHTML += `<p class="${tagClassname}">${tagText} ${partnerId}</p>`
    msgHead.innerHTML += `<div class="d-flex ${flowDir}">
                              <p class="${tagClassname}">${tagText} ${partnerId} ${dateString}</p>
                          </div>`;
    msgHead.innerHTML += `<div class="d-flex ${flowDir}">
                              <p class="${bubble} shadow-lg rounded-pill py-1 px-4">${msg}</p>
                          </div>`;
    msgHead.scrollTop = msgHead.scrollHeight;
  };

  const addToDropdown = (conn) => {
    let ul = document.querySelector('#ul-dropdown');
    ul.innerHTML += `<li><a class="dropdown-item" href="#" data-id="${conn.peer}">${conn.peer}</a></li>`
    if (document.querySelector('#btn-dropdown').innerText.trim() == 'Choose receiver') {
      document.querySelector('#btn-dropdown').innerText = conn.peer;
      sendReceivers = [];
      sendReceivers.push(conn.peer);
    }
  }

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
    let list = [...document.querySelector('#ul-dropdown').querySelectorAll('a')].map(el => el.dataset.id);

    if (conn.peer == list[list.length - 1]) {
      console.log(`last item`);
      document.querySelector("#input-msg").value = "";
      document.querySelector("#input-msg").focus();
    }
  }

  // Initiate the connection request
  const connect = (evt) => {
    let partnerId = document.querySelector("#input-partner-id").value;
    document.querySelector("#input-partner-id").value = '';

    let conn = peer.connect(partnerId);
    connArr.push(conn);
    displayMsg(`Initiating connection`, partnerId, true);

    // When the connection is successfully open...
    conn.on("open", () => {

      // setConnStatus('Successfully connnected');
      displayMsg(`Success! Connection Id= ${conn.connectionId}`, partnerId, true);

      // Add item to dropdown
      addToDropdown(conn);

      conn.on("data", (data) => {
        displayMsg(`${data}`, partnerId, false);
        console.log(data);
      });

      sendMsg.addEventListener("click", function () {
        sendMessage(conn);
      });
    });
  };

  const initialize = () => {
    // peer = new Peer(null, {
    //     host: 'videodesk-ennesimo.herokuapp.com',
    //     port: 443,
    //     secure: true
    // });
    peer = new Peer(null, {
      host: "evening-atoll-16293.herokuapp.com",
      port: 443,
      secure: true,
    });

    peer.on("open", function (id) {
      // log your id
      document.querySelector("#my-id").innerText = id;
      console.log("My peer ID is: " + id);
      me = id;


      // This is the major split, process flow inside either connect() or the peer.on('connection')
      // If you initiate connection request, the flow is inside the connect subroutine
      // If you are the receiver of the connection request, the flow is inside the peer.on('connection')
      // Note: a particular user can both initiate with one user and also be a receiver for another user

      // Connect() process flow if you click the connect to initiate the connection request
      document
        .querySelector("#connect-partner-id")
        .addEventListener("click", connect);

      // peer.on('connectin') process flow if you are the receiver of the connection requrest
      peer.on("connection", (conn) => {
        displayMsg(`Accepted connection request, connection id = ${conn.connectionId}`, conn.peer, false);

        conn.on("open", () => {
          // Add it to the dropdown
          addToDropdown(conn);

          conn.on("data", (data) => {
            displayMsg(`${data}`, conn.peer, false)
            // msgHead.innerHTML += `<p>Received: ${data}</p>`;
            // msgHead.scrollTop = msgHead.scrollHeight;
          });

          sendMsg.addEventListener("click", (evt) => sendMessage(conn));
        });
      });
    });
  };

  document.querySelector("#input-msg").addEventListener("keyup", (evt) => {
    if (evt.key !== "Enter") return;
    sendMsg.click();
    evt.preventDefault();
  });

  initialize();
})();
