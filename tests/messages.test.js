const { addUser, getUser } = require("../src/utils/users");
const { user } = require("./fixtures/db");
const { generateMessage, generateLocationMessage} = require("../src/utils/messages");

describe('Test messages function', () => {
  test("Generate message", () => {
    addUser(user)
    const userData = getUser(user.id)
    const message = generateMessage(userData.username, `Hello ${userData.username}`)
    expect(message).toEqual(
      expect.objectContaining({
        text: `Hello ${userData.username}`,
        username: userData.username,
      })
    );
  });

  test("Generate location message", () => {
    addUser(user)
    const userData = getUser(user.id)
    const locationMessage = generateLocationMessage(userData.username, `https://google.com/maps?q=41.40338,2.17403`)
    expect(locationMessage).toEqual(
      expect.objectContaining({
        username: userData.username,
        url: `https://google.com/maps?q=41.40338,2.17403`
      })
    );
  });
})
