let path = require('path');

let conf = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, './dist/js/'),
        filename: 'main.js',
        publicPath: 'dist/js/',
    },
    devServer: {
        overlay:true,
        /*contentBase: path.join(__dirname, "dist"),*/
        port: 9000
    },
    module:{
        rules: [
            {
                test:/\.js$/,
                loader:'babel-loader',
                //exclude:'/node_modules/'
            },
            {
                test:/\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    //devtool:"eval-sourcemap"

};

module.exports = (env, option ) => {

    let production = option.mode === 'production';

    conf.devtool = production
                    ? false
                    : 'eval-sourcemap';

    return conf;
};