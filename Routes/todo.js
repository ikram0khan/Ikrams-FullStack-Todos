const express = require("express");
const todoSchema = require("../Schemas/TodosSchema.js");
const collectionSchema = require("../Schemas/collectionSchema.js");
const ErrorHandler = require("../middlewares/ErrorHandler.js");
const isAuth = require("../middlewares/auth.js");
const router = express.Router();

//Create Collection --Done
router.post("/collection/create", isAuth, async (req, res, next) => {
  try {
    const { collectionName, description } = req.body;
    if (collectionName === "" || description === "") {
      return res.status(401).json({
        message: "Please Fill The Credentials",
      });
    }
    const collection = await collectionSchema.create({
      collectionName: collectionName,
      collectionDescripton: description,
    });
    res.status(200).json({
      collection,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});

//Update Collection

router.put("/collection/update/:id", async (req, res, next) => {
  try {
    const collectionId = req.params.id;

    const collection = await collectionSchema.findById(collectionId);
    if (!collection) {
      return next(new ErrorHandler("No Collection Found", 404));
    }
    const { collectionName, description } = req.body;
    await collectionSchema.updateOne(
      { _id: collectionId },
      { $set: { collectionName: collectionName, description: description } }
    );
    res.status(200).json({
      message: "Collection Updated",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});

//Delete Collection

router.delete("/collection/dlete/:id", async (req, res, next) => {
  try {
    const collectionId = req.params.id;
    const collection = await collectionSchema.findOne({ _id: collectionId });
    if (!collection) {
      return next(new ErrorHandler("No Collection Found", 404));
    }
    await todoSchema.deleteMany({ collectionId: collectionId });
    await collectionSchema.deleteOne({ _id: collectionId });

    res.status(200).json({
      message: "Collection Deleted",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});

//Get All Collections -- Done

router.get("/collection/all", isAuth, async (req, res, next) => {
  try {
    let collections = await collectionSchema.find({});
    res.status(200).json({
      collections,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 401));
  }
});

//Create Todo -- Done

router.post("/todo/create", async (req, res, next) => {
  const { title, description, collectionId } = req.body;

  if (!title || !collectionId) {
    return next(new ErrorHandler("Please Fill The Credenials", 401));
  }

  let todo = await todoSchema.create({
    collectionId: collectionId,
    title: title,
    description: description,
  });
  res.status(200).json({
    todo,
  });
});

//Get ALl Todos Of A Collection  --Done

router.get("/todo/:id", isAuth, async (req, res, next) => {
  try {
    const todos = await todoSchema.find({
      collectionId: req.params.id,
    });
    if (todos.length === 0) {
      return next(new ErrorHandler("This Collection Is Empty", 401));
    }
    res.status(200).json({
      todos,
    });
  } catch (error) {}
});

// Complete Todo
router.put("/todo/completed/:id", async (req, res, next) => {
  await todoSchema.updateOne(
    { _id: req.params.id },
    { $set: { isCompleted: true } }
  );
  res.status(200).json({
    message: "Todo Completed",
  });
});

// Delete Todo

router.post("/todo/delete", async (req, res, next) => {
  try {
    const { todoId } = req.body;
    await todoSchema.findOne({ _id: todoId });

    await todoSchema.deleteOne({ _id: todoId });
    res.status(200).json({
      message: "Todo Deleted",
    });
  } catch (error) {}
});

module.exports = router;
