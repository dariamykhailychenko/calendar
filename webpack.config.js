const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    devServer: {
        historyApiFallback: true,
        contentBase: path.resolve(__dirname, "dist"),
        open: true,
        compress: true,
        hot: true,
        port: 8080,
    },
    entry: {
        calendar: "./calendar.js",
        createEvent: "./create-event.js",
        main: "./main.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].bundle.js",
    },
    resolve: {
        alias: {
          images: path.resolve(__dirname, "./assets/icons/"),
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: "body",
            title: "create-event",
            template: "./create-event.html", 
            filename: "create-event/index.html",
            chunks: ["main", "createEvent"]
        }),
        new HtmlWebpackPlugin({
            inject: "body",
            title: "calendar",
            template: "./calendar.html", 
            filename: "index.html",
            chunks: ["main", "calendar"]
        }),
        new CopyPlugin({
            patterns: [
              { from: "assets/icons", to: "assets/icons" }
            ],
          }),
        new CleanWebpackPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new MiniCssExtractPlugin({
            filename: "[name].bundle.css",
        })
    ],
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
                use: ["file-loader"],
            },
        ],
    },
}