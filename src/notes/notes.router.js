const router = require("express").Router();
const controller = require("./notes.controller");

router
  .route("/:noteId")
  .get(controller.read)
  .put(controller.update)
  .delete(controller.delete);

router.route("/").get(controller.list).post(controller.create);

module.exports = router;
