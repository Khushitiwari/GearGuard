import Equipment from "../models/equipement.model.js";

export const createEquipment = async (req, res) => {
    try {
        const {
            name,
            category,
            serialNumber,
            location,
            purchaseDate,
            warrantyExpiry,
            assignedTo,
            owner
        } = req.body;

        if (
            !name ||
            !category ||
            !serialNumber ||
            !location ||
            !purchaseDate ||
            !warrantyExpiry
        ) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        const equipment = await Equipment.create({
            name,
            category,
            serialNumber,
            location,
            purchaseDate,
            warrantyExpiry,
            assignedTo,
            owner
        });

        res.status(201).json({
            success: true,
            message: "Equipment created",
            equipment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getAllEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.find()
            .populate("assignedTo", "teamName")
            .populate("owner", "name email");

        res.json({ success: true, equipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getEquipmentById = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id)
            .populate("assignedTo", "teamName")
            .populate("owner", "name email");

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        res.json({ success: true, equipment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const updateEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        Object.assign(equipment, req.body);
        await equipment.save();

        res.json({
            success: true,
            message: "Equipment updated",
            equipment
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findById(req.params.id);

        if (!equipment) {
            return res.status(404).json({
                success: false,
                message: "Equipment not found"
            });
        }

        await equipment.deleteOne();

        res.json({
            success: true,
            message: "Equipment deleted"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
