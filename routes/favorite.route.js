const { express } = require("../app");
const authValidator = require("../validators/auth.validator");
const mainValidator = require("../validators/validator.main");
const favoriteController = require("../controllers/favorite.controller");
const router = express.Router();

router.get(
  "/me",
  [authValidator.validateJwtToken],
  favoriteController.getFavorites
);
router.post(
  "/:id",
  [authValidator.validateJwtToken, mainValidator.validateFavoriteReq],
  favoriteController.addFavorites
);
router.delete(
  "/:id",
  [authValidator.validateJwtToken, mainValidator.validateFavoriteReq],
  favoriteController.removeFavorites
);

module.exports = router;
