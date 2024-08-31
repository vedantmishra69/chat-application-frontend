/* eslint-disable no-unused-vars */
let db;
const dbName = "MessagesDatabase";
const dbVersion = 7;

const request = indexedDB.open(dbName, dbVersion);

request.onerror = (event) => {
  console.error("Database error: " + event.target.error);
};

request.onsuccess = (event) => {
  db = event.target.result;
  console.log("Database opened successfully");
};

request.onupgradeneeded = (event) => {
  db = event.target.result;
  const oldVersion = event.oldVersion;

  if (oldVersion < 1) {
    const objectStore = db.createObjectStore("messages", { keyPath: "id", autoIncrement: true });
    objectStore.createIndex("content", "content", { unique: false });
    objectStore.createIndex("recipient", "recipient", { unique: false });
    objectStore.createIndex("user", "user", { unique: false });
    objectStore.createIndex("time", "time", { unique: false });
  }

  if (oldVersion < 2) {
    // Upgrade to version 2
    const objectStore = event.target.transaction.objectStore("messages");
    objectStore.createIndex("username", "username", { unique: false });

    // Update existing records to add username field if necessary
    objectStore.openCursor().onsuccess = function (cursorEvent) {
      const cursor = cursorEvent.target.result;
      if (cursor) {
        if (!cursor.value.username) {
          const updatedRecord = cursor.value;
          updatedRecord.username = "default_user"; // Set a default value
          cursor.update(updatedRecord);
        }
        cursor.continue();
      }
    };
  }

  if (oldVersion < 7) {
    const objectStore = event.target.transaction.objectStore("messages")
    objectStore.clear()
  }

  console.log("Object store created/updated.");
};

export const addMessage = (content, username, recipient, user) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["messages"], "readwrite");
    const objectStore = transaction.objectStore("messages");

    const message = {
      content: content,
      username: username,
      recipient: recipient,
      user: user,
      time: new Date().getTime()
    };

    const request = objectStore.add(message);

    request.onerror = (event) => {
      reject("Error adding message: " + event.target.error);
    };

    request.onsuccess = (event) => {
      resolve("Message added successfully");
    };
  });
}

export const getMessages = (recipient, username) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["messages"], "readonly");
    const objectStore = transaction.objectStore("messages");
    const index = objectStore.index("recipient");

    const request = index.getAll(recipient);

    request.onerror = (event) => {
      reject("Error querying messages: " + event.target.error);
    };

    request.onsuccess = (event) => {
      const allMessages = request.result;
      const filteredMessages = allMessages.filter(message => message.username === username);
      resolve(filteredMessages);
    };
  });
}
