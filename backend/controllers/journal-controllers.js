const { v7: uuid } = require("uuid");
const { validationResult } = require("express-validator");

const getCoordsForAddress = require("../util/geocode");
const Journal = require("../models/journal");
const HttpError = require("../models/http-error");

const getEntryById = async (req, res, next) => {
  const entryId = req.params.pid;

  let entry;
  try {
    entry = await Journal.findById(entryId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find an entry.",
      500
    );
    return next(error);
  }

  if (!entry) {
    const error = new HttpError(
      "Could not find an entry for the provided id.",
      404
    );
    return next(error);
  }

  res.json({ entry: entry.toObject({ getters: true }) });
};

const getEntriesByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let entries;
  try {
    entries = await Journal.find({ author: userId });
  } catch (err) {
    const error = new HttpError(
      "Fetching entries failed, please try again later",
      500
    );
    return next(error);
  }

  if (!entries || entries.length === 0) {
  }

  res.json({
    entries: entries.map((entry) => entry.toObject({ getters: true })),
  });
};

const createEntry = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { headline, journalText, locationName, author } = req.body;

  let coordinates;

  try {
    coordinates = await getCoordsForAddress(locationName);
  } catch (error) {
    return next(error);
  }

  const createdEntry = new Journal({
    id: uuid(),
    headline,
    journalText,
    photo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpPkm3Hhfm2fa7zZFgK0HQrD8yvwSBmnm_Gw&s",
    locationName,
    coordinates: {
        latitude: coordinates.lat, 
        longitude: coordinates.lng
    },
    author,
  });

  try {
    await createdEntry.save();
  } catch (err) {
    const error = new HttpError("Creating entry failed, please try again", 500);
    return next(error);
  }

  res.status(201).json({ entry: createdEntry });
};

const updateEntry = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { headline, journalText } = req.body;
  const entryId = req.params.pid;

  let entry;
  try {
    entry = await Journal.findById(entryId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update entry.",
      500
    );
    return next(error); 
  }

  entry.headline = headline;
  entry.journalText = journalText;

  try {
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update entry.",
      500
    );
    return next(error);
  }

  res.status(200).json({ entry: entry.toObject({ getters: true }) });
};

const deleteEntry = async (req, res, next) => {
  const entryId = req.params.pid;

  let entry;
  try {
    entry = await Journal.findById(entryId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete entry.",
      500
    );
    return next(error);
  }

  if (!entry) {
    return next(new HttpError("Could not find entry for this id.", 404));
  }

  try {
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete entry.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Deleted entry." });
};

exports.getEntryById = getEntryById;
exports.getEntriesByUserId = getEntriesByUserId;
exports.createEntry = createEntry;
exports.updateEntry = updateEntry;
exports.deleteEntry = deleteEntry;