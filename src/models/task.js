const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;

// const correctSomeone = new Task({
//   description: "Zelda is the princess!",
//   completed: false,
// });

// correctSomeone
//   .save()
//   .then(() => console.log(correctSomeone))
//   .catch((error) => console.error(error));
