const mix = require("laravel-mix");

mix.disableNotifications();
mix.sass("src/scss/app.scss", "dist");
