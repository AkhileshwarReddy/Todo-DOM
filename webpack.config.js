module.exports = {
    mode: "development",
    devServer: {
        contentBase: "./"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [{loader: 'babel-loader'}],
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ['css-loader', 'style-loader']
            }
        ]
    },
    watch: true
}