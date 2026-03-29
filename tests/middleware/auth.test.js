const { ensureAuthenticated } = require('../../middleware/auth');

describe('Auth Middleware', () => {
  describe('ensureAuthenticated', () => {
    test('should call next() if user is authenticated', () => {
      const req = {
        isAuthenticated: jest.fn().mockReturnValue(true),
      };

      const res = {
        redirect: jest.fn(),
      };

      const next = jest.fn();

      ensureAuthenticated(req, res, next);

      expect(req.isAuthenticated).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(res.redirect).not.toHaveBeenCalled();
    });

    test('should redirect to /login if user is not authenticated', () => {
      const req = {
        isAuthenticated: jest.fn().mockReturnValue(false),
      };

      const res = {
        redirect: jest.fn(),
      };

      const next = jest.fn();

      ensureAuthenticated(req, res, next);

      expect(req.isAuthenticated).toHaveBeenCalled();
      expect(res.redirect).toHaveBeenCalledWith('/login');
      expect(next).not.toHaveBeenCalled();
    });

    test('should check authentication status before proceeding', () => {
      const req = {
        isAuthenticated: jest.fn().mockReturnValue(true),
      };

      const res = {
        redirect: jest.fn(),
      };

      const next = jest.fn();

      const isAuthenticatedSpy = jest.spyOn(req, 'isAuthenticated');

      ensureAuthenticated(req, res, next);

      expect(isAuthenticatedSpy).toHaveBeenCalled();
    });

    test('should work with multiple users', () => {
      // Test with authenticated user
      const authenticatedReq = {
        isAuthenticated: jest.fn().mockReturnValue(true),
      };

      const res1 = {
        redirect: jest.fn(),
      };

      const next1 = jest.fn();

      ensureAuthenticated(authenticatedReq, res1, next1);
      expect(next1).toHaveBeenCalled();

      // Test with unauthenticated user
      const unauthenticatedReq = {
        isAuthenticated: jest.fn().mockReturnValue(false),
      };

      const res2 = {
        redirect: jest.fn(),
      };

      const next2 = jest.fn();

      ensureAuthenticated(unauthenticatedReq, res2, next2);
      expect(res2.redirect).toHaveBeenCalledWith('/login');
      expect(next2).not.toHaveBeenCalled();
    });
  });
});
