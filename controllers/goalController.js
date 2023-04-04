const asyncHandler = require('express-async-handler');

const Goal = require('../models/goalModel');

// @desc Get Goals
// @route GET /api/goals
// @access Private
const getGoals = asyncHandler(async (req,res)=>{
    const goals = await Goal.find({ user: req.user.id });
    res.status(200).json(goals);
});

// @desc Set Goal
// @route POST /api/goals/:id
// @access Private
const setGoal = asyncHandler(async (req, res) => {
    if (!req.body.text) {
        res.status(400);
        throw new Error('Add text');
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    });
    res.status(200).json(goal);
});

// @desc Update Goal
// @route PUT /api/goals/:id
// @access Private
const updateGoal =  asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
        res.status(400);
        throw new Error('Goal not found');
    }
    // Check to ensure that user updates only their goal
    if(goal.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('You are not permitted to take this action.');
    }
    const updatedGoal = await Goal.findByIdAndUpdate(req.params.id, req.body, 
        {new: true});
    res.status(201).json(updatedGoal);
});

// @desc Delete Goal
// @route DELETE /api/goals/:id
// @access Private
const deleteGoal = asyncHandler(async (req, res) => {
    const goal = await Goal.findById(req.params.id);
    if (!goal) {
        res.status(400);
        throw new Error('Goal not found');
    }
    // await Goal.findByIdAndDelete(req.params.id);
    // res.status(200).json({message:`${goal.text} Goal was deleted.`});

    // Check to ensure that user deletes only their goal
    if(goal.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('You are not permitted to take this action.');
    }
    await goal.remove();
    res.status(200).json({id: req.params.id});
});

module.exports = {
    getGoals,
    setGoal,
    updateGoal,
    deleteGoal
};