const { express } = require("../app");
const nftController = require("../controllers/nft.controller");
const fileService = require("../services/file.service");
const authValidator = require("../validators/auth.validator");
const mainValidator = require("../validators/validator.main");
const router = express.Router();

router.get(
  "/all",
  [authValidator.validateJwtForGetReq],
  nftController.getAllNfts
);
router.get("/:id", [mainValidator.validateId], nftController.getNftById);
router.post(
  "/create",
  [
    authValidator.validateJwtToken,
    mainValidator.isCreator,
    fileService.fileUploader.bind(fileService),
    mainValidator.validateBody.bind(null, false, "nft"),
  ],
  nftController.createNft
);
router.put(
  "/update/:id",
  [
    mainValidator.validateId,
    authValidator.validateJwtToken,
    mainValidator.isCreator,
    fileService.fileUploader.bind(fileService),
    mainValidator.validateBody.bind(null, true, "nft"),
  ],
  nftController.updateNft
);
router.delete(
  "/delete/:id",
  [
    mainValidator.validateId,
    authValidator.validateJwtToken,
    mainValidator.isCreator,
  ],
  nftController.deleteNft
);

module.exports = router;
