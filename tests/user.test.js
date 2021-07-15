const request = require("supertest");
const app = require("../src/app");
const User = require("../src/models/user");
const { setupDatabase, userOneId, userOne } = require("./fixtures/db");

const nonexistentUser = {
  email: "tom@test.com",
  password: "qwerty123",
};

beforeEach(setupDatabase);

test("Should signup a new user", async () => {
  const res = await request(app)
    .post("/users")
    .send({
      name: "Herman",
      email: "herman@test.com",
      password: "admin123",
    })
    .expect(201);

  //? assert that db was changed correctly
  const user = await User.findById(res.body.user._id);
  expect(user).not.toBeNull();

  //? assertions about response
  expect(res.body.user.name).toBe("Herman");
});

test("Should log an existing user", async () => {
  const res = await request(app)
    .post("/users/login")
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  const user = await User.findById(res.body.user._id);
  expect(user).not.toBeNull();

  expect(res.body.token).toBe(user.tokens[1].token);
});

test("should not login nonexistent user", async () => {
  await request(app).post("/users/login").send(nonexistentUser).expect(400);
});

test("Should get profile for user", async () => {
  await request(app)
    .get("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);
});

test("Should delete account for user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user).toBeNull();
});

test("Should not delete account for unauthorized user", async () => {
  await request(app)
    .delete("/users/me")
    .set("Authorization", "Bearer fruuuit")
    .send()
    .expect(401);
});

test("Should upload avatar image", async () => {
  await request(app)
    .post("/users/me/avatar")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .attach("avatar", "tests/fixtures/profile-pic.jpg");

  const user = await User.findById(userOneId);
  expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ name: "Kevin" })
    .expect(200);

  const user = await User.findById(userOneId);
  expect(user.name).toEqual("Kevin");
});

test("Should not update invalid user fields", async () => {
  await request(app)
    .patch("/users/me")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({ location: "las vegas" })
    .expect(400);
});
