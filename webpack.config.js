const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
    const PROD = argv.mode === 'production';

    const CFG = {
        entry: PROD ? './src/index.js' : './demo/script.js',
        output: {
            path: __dirname,
            library: 'QuillResize',
            libraryTarget: 'umd',
            filename: 'dist/resize.js'
        },
        devServer: {
            contentBase: './demo'
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: path.join(__dirname, 'src'),
                    exclude: /(node_modules|bower_components)/,
                    use: 'babel-loader'
                },
                {
                    test: /\.css$/,
                    use: ExtractTextPlugin.extract({
                        use: 'css-loader',
                        fallback: 'style-loader'
                    })
                },
                {
                    test: /\.svg$/,
                    use: 'raw-loader'
                }
            ]
        },
        plugins: [new ExtractTextPlugin('dist/resize.css')]
    };

    if (!PROD) {
        CFG.plugins.push(
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: './demo/index.html' //模板地址
            })
        );
    }else{
        // 发布排除quill库
        CFG.externals = {
            quill: 'Quill'
        }
    }

    return CFG;
};
