import { Session } from 'express-session';

declare module 'express-session' {
  interface SessionData {
    filePath?: string;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: Session & Partial<SessionData>;
  }
}
