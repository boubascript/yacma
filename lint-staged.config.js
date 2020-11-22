module.exports = {
    "*.{ts,tsx}": ["prettier --write"],
    "api/**/*.{ts,tsx}": () => 'tsc -p api --noEmit',
    "client/**/*.{ts,tsx}": () => 'tsc -p client --noEmit',
};