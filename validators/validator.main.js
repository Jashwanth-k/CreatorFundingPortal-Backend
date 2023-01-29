function sendResponse(res, status, resObj) {
  res.writeHead(status);
  res.end(JSON.stringify(resObj));
}

function validateId(req, res, next) {
  res.setHeader("content-type", "applications/json");
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      sendResponse(res, 400, { message: "id is not a number" });
      return;
    }
    next();
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

function validateBody(update, validator, req, res, next) {
  res.setHeader("content-type", "applications/json");
  try {
    const userData = req.body;
    let fields;
    if (validator === "music") fields = ["image", "audio", "price", "name"];
    if (validator === "script") fields = ["image", "text", "price", "name"];
    let check = update ? true : false;
    for (let key of fields) {
      check = update ? check && !userData[key] : check || !userData[key];
    }

    if (check) {
      sendResponse(res, 400, { message: "incorrect body format" });
      fileService.delete([req.body.image, req.body.audio, req.body.text]);
      return;
    }
    next();
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

function isCreator(req, res, next) {
  try {
    const role = req.token?.role;
    if (role !== "creator") {
      sendResponse(res, 403, { message: "user can't access resources" });
      return;
    }
    next();
  } catch (err) {
    sendResponse(res, 500, { message: err.message });
  }
}

module.exports = {
  validateId,
  validateBody,
  isCreator,
};
