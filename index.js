require("@babel/register")({
    presets: ["@babel/preset-env"]
  });
require('dotenv').config();
require('./src/lib/server').start();