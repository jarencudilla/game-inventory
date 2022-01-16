"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const register = (app) => {
    const oidc = app.locals.oidc;
    // route handler to index page
    app.get("/", (req, res) => {
        res.render("index");
    });
    // to validate before redirecting to login page before going to library page
    app.get("/login", oidc.ensureAuthenticated(), (req, res) => {
        res.redirect("/games");
    });
    // to handle logout the redirect back to default index page
    app.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/");
    });
    // to handle route from games, check if user is validated
    app.get("/games", oidc.ensureAuthenticated(), (req, res) => {
        res.render("games");
    });
};
exports.register = register;
//# sourceMappingURL=index.js.map