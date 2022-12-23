function registerValid(ctx, next) {

}

function loginValid(ctx, next) {
    const { identifier, password } = ctx.request.body;
    if (!identifier || !password) {
        return ctx.send({ message: "All fields is required", status: 400 }, 400);
    }
    if (password.length < 6) {
        return ctx.send({ message: "Password must be at least 6 characters", status: 400 }, 400);
    }
    return next();
}

module.exports = {
    loginValid,
    registerValid
}