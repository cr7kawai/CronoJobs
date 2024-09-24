import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export function verifyToken(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'No token provided' });
    return;
  }

  const tokenParts = authHeader.split(' ');

  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    res.status(401).json({ message: 'Invalid token format' });
    return;
  }

  const token = tokenParts[1];

  try {
    const decoded = jwt.verify(token, 'oxIJjs8XYPjNk1hXsaeoybsVU9tx90byhpU6FSa90--6iWM45UlsDkFG5X9q4Rs3') as JwtPayload;

    if (typeof decoded.pk_usuario !== 'undefined') {
      req['userId'] = decoded.pk_usuario;
      next();
    } else {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired' });
      return;
    }

    res.status(401).json({ message: 'Invalid token' });
    return;
  }
}