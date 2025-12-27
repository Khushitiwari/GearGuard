import User from "../models/user.model.js";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const register = async (req, res) => {

    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.json({ success: false, message: "Enter all credentials properly!" })
        }

        const isExist = await User.findOne({ email });

        if (isExist) {
            return res.json({ success: false, message: "User already exists!" })
        }

        const hashedPass = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPass,
            role
        });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        );

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }

        res.cookie('token', token,
            options
        )

        return res.json({ success: true, message: "User registered successfully!", user });

    } catch (error) {
        return res.json({ success: false, message: "User registration failed!", error });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: "Enter all credentials properly!" })
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User not found!" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: "Invalid credentials!" })
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
        );

        const options = {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        }

        res.cookie('token', token,
            options
        )

        return res.json({ success: true, message: "User logged in successfully!", user });

    } catch (error) {
        return res.json({ success: false, message: "User login failed!", error });
    }
}

const logout = async (req, res) => {
    try {
        res.cookie('token', null, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 0
        });

        return res.json({ success: true, message: "User logged out successfully!" });

    } catch (error) {
        return res.json({ success: false, message: "User logout failed!", error });
    }
}

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password -otp -otpExpiryAt');
        return res.json({ success: true, users });
    } catch (error) {
        return res.json({ success: false, message: "Failed to fetch users!", error });
    }
}

export { register, login, logout, getAllUsers }