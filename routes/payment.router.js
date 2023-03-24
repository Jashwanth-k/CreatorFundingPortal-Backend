const { express } = require("../app");
const paymentController = require("../controllers/payment.controller");
const authValidator = require("../validators/auth.validator");
const mainValidator = require("../validators/validator.main");
const router = express.Router();

router.post(
  "/send/:id",
  [authValidator.validateJwtToken, mainValidator.validateFavoriteReq],
  paymentController.addPayment
);
router.get(
  "/getAll",
  [authValidator.validateJwtToken],
  paymentController.getPayments
);
module.exports = router;
