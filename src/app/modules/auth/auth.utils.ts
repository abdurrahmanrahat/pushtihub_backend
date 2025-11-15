import { google } from 'googleapis';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';

export const createJwtToken = (
  jwtPayload: JwtPayload,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyJwtToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export const googleClient = () => {
  const GOOGLE_CLIENT_ID = config.google_oauth_client_id;
  const GOOGLE_CLIENT_SECRET = config.google_oauth_client_secret;

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'postmessage',
  );

  return oauth2Client;
};
