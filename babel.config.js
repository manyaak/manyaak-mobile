module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@/routes': './src/routes',
            '@/constants': './src/constants',
            '@/screens': './src/screens',
          },
        },
      ],
    ],
  };
};
