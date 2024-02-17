const {ObjectId} = require("mongodb");
const mongodb = require("../data/database");
const yup = require("yup");
const bcrypt = require('bcrypt');

const createUserSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    email: yup.string().email("Invalid email address").required("Email is required"),
    password: yup.string().min(6, "Password must be at least 6 characters long").required("Password is required"),
});

const getAllUsers = async (req, res) => {
    try {
        const result = await mongodb.getDatabase().db().collection("users").find();
        const users = await result.toArray();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: "Internal server error"});
    }
};

const getSingleUser = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const user = await mongodb.getDatabase().db().collection("users").findOne({_id: userId});

        if (!user) {
            res.status(404).json({error: "User not found"});
        } else {
            res.status(200).json(user);
        }
    } catch (error) {
        res.status(500).json({error: "Internal server error"});
    }
};

const createUser = async (req, res) => {
    try {
        await createUserSchema.validate(req.body, { abortEarly: false });

        const existingUser = await mongodb.getDatabase().db().collection("users").findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email },
            ],
        });

        if (existingUser) {
            return res.status(400).json({ error: "Username or email already exists" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = {
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        };

        const response = await mongodb.getDatabase().db().collection("users").insertOne(newUser);

        if (response.acknowledged) {
            res.status(201).json({ message: `${newUser.username} user was successfully created` });
        } else {
            res.status(500).json({ error: response.error || "Some error occurred while creating the user." });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
};

const updateUser = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);

        const user = await mongodb.getDatabase().db().collection("users").findOne({_id: userId});

        if (!user) {
            return res.status(404).json({error: "User not found"});
        }

        const response = await mongodb.getDatabase().db().collection("users").updateOne({_id: userId}, {$set: req.body});

        if (response.modifiedCount > 0) {
            res.status(200).json({message: "User updated successfully"});
        } else {
            res.status(500).json({
                error: response.error || "To update a user, you need to update at least one property",
            });
        }
    } catch (err) {
        res.status(400).json({errors: err.errors || err.message});
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = new ObjectId(req.params.id);
        const response = await mongodb.getDatabase().db().collection("users").deleteOne({_id: userId});

        if (response.deletedCount > 0) {
            res.status(204).end();
        } else {
            res.status(404).json({error: "User not found"});
        }
    } catch (error) {
        res.status(500).json({error: "Internal server error"});
    }
};

module.exports = {
    getAllUsers,
    getSingleUser,
    createUser,
    updateUser,
    deleteUser,
};
