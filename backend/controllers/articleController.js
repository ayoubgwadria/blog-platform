const Article = require("../models/Article");

exports.createArticle = async (req, res) => {
  try {
    const article = await Article.create({
      ...req.body,
      author: req.user.id,
    });
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    console.log(`Fetching articles - Page: ${page}, Limit: ${limit}, Skip: ${skip}`);

    const [articles, count] = await Promise.all([
      Article.find()
        .populate("author", "email role")
        .populate({
          path: "comments",
          populate: [
            { path: "author", select: "email role" }, 
            { 
              path: "parentComment", 
              populate: { path: "author", select: "email role" } 
            },
            { 
              path: "replies",  
              populate: { path: "author", select: "email role" } 
            },
          ],
        })
        .sort("-createdAt")
        .skip(skip)
        .limit(limit),
      Article.countDocuments(),
    ]);

    console.log(`Articles fetched: ${articles.length}, Total count: ${count}`);

    res.json({
      data: articles,
      meta: {
        page,
        limit,
        total: count,
        hasNext: count > page * limit,
      },
    });
  } catch (error) {
    console.error("Error fetching articles:", error);
    res.status(500).json({ message: error.message });
  }
};



exports.updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, $inc: { views: 1 } },
      { new: true, runValidators: true }
    ).populate("author", "email");

    if (!article) return res.status(404);
    res.json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.json({ message: "Article supprimé" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};