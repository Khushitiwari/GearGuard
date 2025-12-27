import Request from "../models/request.model.js";

export const createRequest = async (req, res) => {
    try {
        const {
            subject,
            description,
            equipment,
            type,
            team,
            technician,
            scheduledAt,
            duration,
            priority
        } = req.body;

        if (
            !subject ||
            !description ||
            !equipment ||
            !type ||
            !team ||
            !technician ||
            !scheduledAt ||
            !duration ||
            !priority
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const request = await Request.create({
            subject,
            description,
            createdFrom: req.user.id,
            equipment,
            type,
            team,
            technician,
            scheduledAt,
            duration,
            priority
        });

        res.status(201).json({
            success: true,
            message: "Request created",
            request
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find()
            .populate("createdFrom", "name email")
            .populate("equipment", "name serialNumber")
            .populate("team", "teamName")
            .populate("technician", "name email");

        res.json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getRequestById = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)
            .populate("createdFrom", "name email")
            .populate("equipment", "name serialNumber")
            .populate("team", "teamName")
            .populate("technician", "name email");

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        res.json({ success: true, request });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        Object.assign(request, req.body);
        await request.save();

        res.json({
            success: true,
            message: "Request updated",
            request
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteRequest = async (req, res) => {
    try {
        const request = await Request.findById(req.params.id);

        if (!request) {
            return res.status(404).json({
                success: false,
                message: "Request not found"
            });
        }

        await request.deleteOne();

        res.json({
            success: true,
            message: "Request deleted"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
