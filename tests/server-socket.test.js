const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const { generateMessage, generateLocationMessage} = require("../src/utils/messages");
const { getUser, addUser } = require("../src/utils/users");
const { user } = require("./fixtures/db")

describe("Socket.io testing", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);
      io.on("connection", (socket) => {
        serverSocket = socket;
      });
      clientSocket.on("connect", done);
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test('Should connect', (done) => {
    // once connected, emit Hello World
    clientSocket.emit('message', 'Hello World');
    serverSocket.once('message', (message) => {
      // Check that the message matches
      expect(message).toBe('Hello World');
      done();
    });
    serverSocket.on('connection', (mySocket) => {
      expect(mySocket).toBeDefined();
    });
  });

  test("Send message", ( done) => {
    addUser(user)
    const userData = getUser(user.id)

    clientSocket.on("message", (data, callback) => {
      expect(data).toEqual(
        expect.objectContaining({
          text: `Hello ${userData.username}`,
          username: userData.username,
        })
      );
      done();
    });

    serverSocket.emit("message", generateMessage(userData.username, `Hello ${userData.username}`));
  });

  test("Send location", ( done) => {
    addUser(user)
    const userData = getUser(user.id)

    clientSocket.on("locationMessage", (data, callback) => {
      expect(data).toEqual(
        expect.objectContaining({
          username: userData.username,
          url: `https://google.com/maps?q=41.40338,2.17403`
        })
      );
      done();
    });

    serverSocket.emit('locationMessage', generateLocationMessage(userData.username, `https://google.com/maps?q=41.40338,2.17403`))
  });

  test("should work (with ack)", (done) => {
    serverSocket.on("message", (cb) => {
      cb('Delivered!');
    });
    clientSocket.emit("message", (arg) => {
      expect(arg).toBe('Delivered!');
      done();
    });
  });
});
