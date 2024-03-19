"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    moduleFileExtensions: ['js', 'json', 'ts'],
    modulePaths: ['.'],
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
    collectCoverageFrom: ['src/server/**/*.(t|j)s'],
    coveragePathIgnorePatterns: ['src/server/console', 'src/server/migration'],
    coverageDirectory: 'coverage',
    testEnvironment: 'node',
    detectOpenHandles: true,
    testTimeout: 30000,
    forceExit: true
};
exports.default = config;
//# sourceMappingURL=jest.config.js.map