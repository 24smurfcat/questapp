import { UserRow } from "../interfaces/models";
import { signup, login, changePassword } from "../functions/usersManager";
import { Response, Request } from "express";
import { RowDataPacket } from "mysql2";
import db from "../connection";

// User Details
export const loginUser = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        const user = await login(username, password);

        // SUCCESS

        res.status(200).json({ username });
        return;
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
            return;
        } else {
            res.status(400).json({ error: "Internal server error." });
            return;
        }
    }
};

export const signupUser = async (req: Request, res: Response) => {
    const { name, username, password } = req.body;

    try {
        const user = await signup(name, username, password);

        // SUCCESS

        res.status(200).json({ username });
        return;
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
            return;
        } else {
            res.status(400).json({ error: "Internal server error." });
            return;
        }
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { username } = req.body;
    const { id } = req.params;

    if (!username || !id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const query = "UPDATE users SET username = ? WHERE id = ?";

    await db
        .query(query, [username, id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
        });
};

export const updatePassword = async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const { id } = req.params;

    if (!oldPassword || !newPassword || !id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    try {
        const confirm = await changePassword(id, oldPassword, newPassword);

        if (confirm[0].affectedRows != 1) {
            res.status(400).json({ error: "Internal server error." });
            return;
        }

        res.status(200).json({
            message: "Password has been successfully updated.",
        });
        return;
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(400).json({ error: err.message });
            return;
        } else {
            res.status(400).json({ error: "Internal server error." });
            return;
        }
    }
};

export const removeUser = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const query = "DELETE FROM users WHERE id = ?";

    await db
        .query(query, [id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });
};

export const getUserInfo = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const query = "SELECT id, name, username FROM users WHERE id = ?";

    await db
        .query(query, [id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });
};

export const getUserStats = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const userQuery = "SELECT streak FROM users WHERE id = ?";

    const membershipQuery =
        "SELECT (SELECT COUNT(*) FROM memberships WHERE user_id = ?) AS joined_groups, (SELECT COUNT(*) FROM groups WHERE owner_id = ?) AS owned_groups FROM dual";

    const votesQuery =
        "SELECT votes.id, question, group_id, from_id, to_id FROM questions INNER JOIN votes ON questions.id = votes.question_id WHERE date = CURDATE();";

    const streak = await db.query<UserRow[]>(userQuery, [id]).catch((err) => {
        res.status(400).json({ error: err });
        return;
    });

    const counts = await db
        .query<RowDataPacket[]>(membershipQuery, [id, id])
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });

    const votes = await db
        .query<RowDataPacket[]>(votesQuery, [id, id])
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });

    if (!streak || !counts || !votes) {
        res.status(400).json({
            error: "There was an error while getting the statistics.",
        });
        return;
    }

    try {
        const allVotes = votes[0];
        const userVotes = votes[0].filter(
            (vote) => vote.to_id.toString() === id
        );

        res.status(200).json([
            {
                streak: streak[0][0].streak,
                joinedGroups: counts[0][0].joined_groups,
                ownedGroups: counts[0][0].owned_groups,
                votes: {
                    votedPercentage: (userVotes.length / allVotes.length) * 100,
                    allVotes: allVotes.length,
                    userVotes: userVotes.length,
                },
            },
        ]);
        return;
    } catch (err) {
        res.status(400).json({ error: err });
        return;
    }
};

export const getNotifications = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({
            error: "All fields are required.",
        });
        return;
    }

    const query =
        "SELECT * FROM notifications INNER JOIN groups ON notifications.group_id = groups.id WHERE user_id = ?";

    await db
        .query(query, [id])
        .then((result) => {
            res.status(200).json(result[0]);
            return;
        })
        .catch((err) => {
            res.status(400).json({ error: err });
            return;
        });
};
