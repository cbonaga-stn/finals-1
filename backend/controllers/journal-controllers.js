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
  console.log("Fetching entries for user:", userId);   // log 1

  let entries;
  try {
    entries = await Journal.find({ author: userId });
    console.log("Database result:", entries);   // log 2
  } catch (err) {
    console.error("Error during DB query:", err);   // log 3
    const error = new HttpError(
      "Fetching entries failed, please try again later",
      500
    );
    return next(error);
  }

  if (!entries || entries.length === 0) {
    console.log("No entries found for user:", userId);   // log 4
    return res.json({ entries: [] });   // only return empty if truly empty
  }

  console.log(
    "Does this userId match entry.author?",
    entries[0]?.author?.toString() === userId
  ); // log 5

  res.json({
    entries: entries.map((entry) => entry.toObject({ getters: true })),
  });
};

const createEntry = async (req, res, next) => {
  console.log("CreateEntry triggered"); // start of function
  console.log("Request body =", req.body); // important variable

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Validation failed =", errors.array()); // branch check
    return next(new HttpError("Invalid inputs passed, please check your data.", 422));
  }

  const { headline, journalText, locationName, author } = req.body;
  console.log("Extracted fields =", { headline, journalText, locationName, author }); // before geocode

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(locationName); // suspected line
    console.log("Coordinates received =", coordinates); // after geocode
  } catch (error) {
    console.error("Geocoding error =", error); // error branch
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
      longitude: coordinates.lng,
    },
    author,
  });
  console.log("Entry object before save =", createdEntry); // before save

  try {
    await createdEntry.save(); // suspected line
    console.log("Entry saved successfully"); // after save
  } catch (err) {
    console.error("Error saving entry =", err); // error branch
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
  await entry.save(); // ✅ this actually writes the changes to the DB
  console.log("Update successful for entry:", entryId); // debug log
} catch (err) {
  console.error("Error saving updated entry:", err); // debug log
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
  console.log("Delete request received for entry:", entryId); // start log

  let entry;
  try {
    entry = await Journal.findById(entryId);
    console.log("Entry found:", entry); // after query log
  } catch (err) {
    console.error("Error finding entry:", err); // error log
    const error = new HttpError(
      "Something went wrong, could not delete entry.",
      500
    );
    return next(error);
  }

  if (!entry) {
    console.log("No entry found for id:", entryId); // branch log
    return next(new HttpError("Could not find entry for this id.", 404));
  }

  try {
    await entry.deleteOne(); // ✅ delete from DB
    console.log("Entry deleted successfully:", entryId); // success log
  } catch (err) {
    console.error("Error deleting entry:", err); // error log
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