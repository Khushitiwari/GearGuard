import Team from "../models/team.model.js";

export const createTeam = async (req, res) => {
    try {
        const { teamName, leader, members = [], category } = req.body;

        if (!teamName || !leader || !category?.length) {
            return res.json({
                success: false,
                message: "Missing required fields"
            });
        }

        const team = await Team.create({
            teamName,
            leader,
            members,
            category
        });

        res.json({
            success: true,
            message: "Team created successfully",
            team
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


export const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find()
            .populate("leader", "name email role")
            .populate("members", "name email role");

        res.json({ success: true, teams });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate("leader", "name email role")
            .populate("members", "name email role");

        if (!team) {
            return res.json({
                success: false,
                message: "Team not found"
            });
        }

        res.json({ success: true, team });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.json({
                success: false,
                message: "Team not found"
            });
        }

        if (team.leader.toString() !== req.user.id) {
            return res.json({
                success: false,
                message: "Only team leader can update team"
            });
        }

        const { teamName, category, members } = req.body;

        if (teamName) team.teamName = teamName;
        if (category) team.category = category;
        if (members) team.members = members;

        await team.save();

        res.json({
            success: true,
            message: "Team updated successfully",
            team
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.json({
                success: false,
                message: "Team not found"
            });
        }

        await team.deleteOne();

        res.json({
            success: true,
            message: "Team deleted successfully"
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
