const { request, response } = require('express');
const Event = require('../models/Event');

const getEvents = async (req, res = response) => {
  const events = await Event.find().populate('user', 'name');
  try {
    res.json({
      ok: true,
      events,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact admin for more details',
    });
  }
};
const createEvent = async (req, res = response) => {
  const event = new Event(req.body);
  try {
    event.user = req.uid;
    const eventDB = await event.save();
    res.json({
      ok: true,
      event: eventDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact admin for more details',
    });
  }
};
const updateEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const { uid } = req;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'Event no found',
      });
    }
    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'You can not edit this event',
      });
    }
    const eventToUpdate = {
      ...req.body,
      user: uid,
    };

    const eventDB = await Event.findByIdAndUpdate(eventId, eventToUpdate, {
      new: true,
    });

    res.json({
      ok: true,
      event: eventDB,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact admin for more details',
    });
  }
};
const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const { uid } = req;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'Event no found',
      });
    }

    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'You can not edit this event',
      });
    }

    await Event.findByIdAndDelete(eventId);

    res.json({
      ok: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Please contact admin for more details',
    });
  }
};

module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
};
