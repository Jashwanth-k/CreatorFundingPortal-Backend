const { express } = require("../app");
const authValidator = require("../validators/auth.validator");
const favoriteController = require("../controllers/favorite.controller");
const router = express.Router();

router.get(
  "",
  [authValidator.validateJwtToken],
  favoriteController.getFavorites
);
router.post(
  "/:id",
  [authValidator.validateJwtToken],
  favoriteController.addFavorites
);
router.delete(
  "/:id",
  [authValidator.validateJwtToken],
  favoriteController.removeFavorites
);

module.exports = router;
