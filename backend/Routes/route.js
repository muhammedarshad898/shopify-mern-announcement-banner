const express = require("express");
const router = express.Router();

const {
  createAnnouncement,
} = require("../controllers/announcementcontroller");

router.post("/announcement", createAnnouncement);

module.exports = router;