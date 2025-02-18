const express = require("express");
const router = express.Router();
const { articleAuth } = require("../middleware/articlePermissions");
const articleController = require("../controllers/articleController");
const { authMiddleware } = require("../middleware/auth");

router.post(
  "/create",
  authMiddleware(),
  articleAuth.create,
  articleController.createArticle
);

router.get("/", articleController.getArticles);

router.patch(
  "/update/:id",
  authMiddleware(),
  articleAuth.update,
  articleController.updateArticle
);

router.delete(
  "/delete/:id",
  authMiddleware(),
  articleAuth.delete,
  articleController.deleteArticle
);

module.exports = router;
