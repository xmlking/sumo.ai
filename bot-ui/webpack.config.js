const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";


var config = {
    devtool: isProd ? "hidden-source-map" : "source-map",
    context: path.resolve("./src"),
    entry: {
        app: "./index.ts",
        vendor: "./vendor.ts",
    },
    output: {
        path: path.resolve("./dist"),
        filename: "[name].bundle.js",
        sourceMapFilename: "[name].bundle.map",
        devtoolModuleFilenameTemplate: function (info) {
            return "file:///" + info.absoluteResourcePath;
        }
    },
    resolve: {
        extensions: [".ts", ".js"]
    },
    module: {
        rules: [
            {
                test: require.resolve('jquery'),
                use: [{
                    loader: 'expose-loader',
                    options: '$'
                }]
            },
            {
                test: /\.ts$/,
                enforce: 'pre',
                loader: 'tslint-loader',
                options: {
                    emitErrors: false,
                    failOnHint: false
                }
            },
            {
                test: /\.ts$/,
                loader: "awesome-typescript-loader"
            },
            {
                test: /\.html$/,
                use: [{
                    loader: 'html-loader',
                    options: {
                        minimize: true,
                        removeComments: false,
                        collapseWhitespace: false
                    }
                }],
            },
            {
                test: /\.(css|scss)$/,
                loader: ["style-loader", "css-loader?sourceMap", "sass-loader?sourceMap"],
                exclude: /node_modules/
            },
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": {
                // eslint-disable-line quote-props
                NODE_ENV: JSON.stringify(nodeEnv)
            }
        }),
        new CopyWebpackPlugin([
            { from: './assets/img', to: 'assets/img' },
            { from: './base-styles.css', to: 'base-styles.css' },
            { from: './base-scripts.js', to: 'base-scripts.js' }
        ]),
        new HtmlWebpackPlugin({
            title: "Chat UI",
            template: "!!ejs-loader!src/index.html"
        }),
        new HtmlWebpackPlugin({
            title: "Chat UI",
            filename: 'index.min.html',
            template: './index.min.html'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: Infinity,
            filename: "vendor.bundle.js"
        }),
        // TODO
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: { warnings: false },
        //     output: { comments: false },
        //     sourceMap: true
        // }),
        new webpack.LoaderOptionsPlugin({
            options: {
                tslint: {
                    emitErrors: false,
                    failOnHint: false
                }
            }
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist/"),
        compress: true,
        port: 3000,
        hot: true
    }
};

module.exports = config;
