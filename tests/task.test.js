const request = require("supertest");
const app = require("../src/app");
const Task = require("../src/models/task");
const {
  setupDatabase,
  userOneId,
  userOne,
  userTwo,
  taskOne,
} = require("./fixtures/db");

beforeEach(setupDatabase);

test("Should create task for user", async () => {
  const res = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send({
      description: "From testing",
    })
    .expect(201);

  const task = await Task.findById(res.body._id);
  expect(task).not.toEqual(false);
});

test("Read tasks of test user", async () => {
  const res = await request(app)
    .get("/tasks")
    .set("Authorization", `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200);

  //? The request returns an array of tasks
  expect(res.body).toHaveLength(2);
});

test("Should not delete task owned by another user", async () => {
  await request(app)
    .delete(`/tasks/${taskOne._id}`)
    .set("Authorization", `Bearer ${userTwo.tokens[0].token}`)
    .send()
    .expect(404);

  //? To check if task does exist
  const task = await Task.findById(taskOne._id);
  expect(task).not.toBeNull();
});
