const express = require('express');
const { check } = require('express-validator');

const journalControllers = require('../controllers/journal-controllers');

const router = express.Router();

router.get('/:pid', journalControllers.getEntryById);

router.get('/user/:uid', journalControllers.getEntriesByUserId);

router.post(
  '/',
  [
    check('headline')
      .not()
      .isEmpty(),
    check('journalText').isLength({ min: 5 }),
    check('locationName')
      .not()
      .isEmpty()
  ],
  journalControllers.createEntry
);

router.patch(
  '/:pid',
  [
    check('headline')
      .not()
      .isEmpty(),
    check('journalText').isLength({ min: 5 })
  ],
  journalControllers.updateEntry
);

router.delete('/:pid', journalControllers.deleteEntry);

module.exports = router;