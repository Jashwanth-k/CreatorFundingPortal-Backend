const fileService = require("../services/file.service");
const nftService = require("../services/nft.service");
const favoriteService = require("../services/favorite.service");
const paymentService = require("../services/payment.service");
const awsService = require("../services/aws.service");
const path = require("path");
const compressDir = process.env.COMPRESS_DIR;
const getFilesFromS3 = JSON.parse(process.env.GET_FILES_FROM_S3 || "false");

function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

async function getAllNfts(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const fetchRes = await nftService.getAll(req.query);
    const userId = req.token?.id;
    if (userId) {
      const favoriteData = await favoriteService.findAll(userId);
      const paymentsData = await paymentService.findAll(userId);
      for (currNft of fetchRes) {
        if (favoriteData.nft.has(currNft.id)) currNft.isLiked = true;
        if (paymentsData.nft.has(currNft.id)) currNft.isPaid = true;
      }
    }
    sendResponse(res, 200, fetchRes);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function getNftById(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const userId = req.token?.id;
    const id = parseInt(req.params.id);
    const fetchRes = await nftService.getOne(id);
    if (userId) {
      const isFavorite = await favoriteService.findOne(userId, id, "nft");
      const isPurchased = await paymentService.hasOne(userId, id, "nft");
      if (isFavorite) fetchRes.isLiked = true;
      if (isPurchased) fetchRes.isPaid = true;
    }
    sendResponse(res, 200, fetchRes);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function createNft(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const createData = req.body;
    createData.userId = req.token?.id;
    // watermark
    await fileService.addWaterMark(req.body.image);
    if (getFilesFromS3) {
      await awsService.uploadToS3(path.join(compressDir + req.body.image));
    } else {
      awsService.uploadToS3(path.join(compressDir + req.body.image));
    }

    const createRes = await nftService.create(createData);
    paymentService.create(
      createRes.dataValues?.userId,
      createRes.dataValues?.id,
      "nft"
    );
    sendResponse(res, 201, createRes);
  } catch (err) {
    fileService.delete([req.body.image]);
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function updateNft(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    const userId = req.token.id;
    const updateData = req.body;
    const nft = await nftService.getOne(id, userId);
    if (req.body.image) {
      fileService.delete([nft.image]);
      // watermark
      await fileService.addWaterMark(req.body.image);
      if (getFilesFromS3) {
        await awsService.uploadToS3(path.join(compressDir + req.body.image));
      } else {
        awsService.uploadToS3(path.join(compressDir + req.body.image));
      }
    }

    const updateRes = await nftService.update(updateData, id);
    sendResponse(res, 200, updateRes);
  } catch (err) {
    fileService.delete([req.body.image]);
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

async function deleteNft(req, res) {
  res.setHeader("content-type", "application/json");
  try {
    const id = parseInt(req.params.id);
    const deleteRes = await nftService.delete(id, req.token?.id);
    sendResponse(res, 200, deleteRes);
  } catch (err) {
    sendResponse(res, err.status || 500, { message: err.message });
  }
}

module.exports = {
  getAllNfts,
  getNftById,
  createNft,
  updateNft,
  deleteNft,
};
