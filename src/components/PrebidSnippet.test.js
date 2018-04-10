import React from 'react';
import PrebidSnippet from './PrebidSnippet';
import renderer from 'react-test-renderer';

describe('The PrebidSnippet component', () => {
    describe('with just a mount point', () => snapshotTest(<PrebidSnippet scriptPath="path/to/my/script.js" />));
    describe('with active prop set to true', () =>
        snapshotTest(<PrebidSnippet scriptPath="path/to/my/script.js" active />));
    describe('with active prop set to false', () =>
        snapshotTest(<PrebidSnippet scriptPath="path/to/my/script.js" active={false} />));
});

function snapshotTest(component) {
    it('is rendered correctly', () => expect(renderer.create(component).toJSON()).toMatchSnapshot());
}
