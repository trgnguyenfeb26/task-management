import { Request, Response } from 'express';
import { User } from '../entity/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '../utils/config';
import { registerValidator, loginValidator } from '../utils/validators';

export const signupUser = async (req: Request, res: Response) => {
  const { name, username, email, password } = req.body;
  const { errors, valid } = registerValidator(name, username, email, password);

  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const existingEmail = await User.findOne({
    where: `"email" ILIKE '${email}'`,
  });

  if (existingEmail) {
    return res
      .status(401)
      .send({ message: `Email '${email}' is already taken.` });
  }

  const existingUser = await User.findOne({
    where: `"username" ILIKE '${username}'`,
  });

  if (existingUser) {
    return res
      .status(401)
      .send({ message: `Username '${username}' is already taken.` });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = User.create({ name, username, email, passwordHash });
  await user.save();

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      email: user.email,
    },
    JWT_SECRET
  );

  return res.status(201).json({
    id: user.id,
    username: user.username,
    email: user.email,
    token,
  });
};

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const { errors, valid } = loginValidator(username, password);

  if (!valid) {
    return res.status(400).send({ message: Object.values(errors)[0] });
  }

  const user = await User.findOne({
    where: `"username" ILIKE '${username}' OR "email" ILIKE '${username}'`,
  });

  if (!user) {
    return res.status(401).send({ message: `User: '${username}' not found.` });
  }

  const credentialsValid = await bcrypt.compare(password, user.passwordHash);

  if (!credentialsValid) {
    return res.status(401).send({ message: 'Invalid credentials.' });
  }

  const token = jwt.sign({ id: user.id, username: user.username, mail: user.email,}, JWT_SECRET);
  return res.status(201).json({
    id: user.id,
    username: user.username,
    email: user.email,
    token,
  });
};
