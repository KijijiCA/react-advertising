import React from 'react';
import GooglePublisherTagsSnippet from './GooglePublisherTagsSnippet';
import renderer from 'react-test-renderer';

describe('The GooglePublisherTagsSnippet component', () => {
    describe('with no props', () => snapshotTest(<GooglePublisherTagsSnippet />));
    describe('with active prop set to true', () => snapshotTest(<GooglePublisherTagsSnippet active />));
    describe('with active prop set to false', () => snapshotTest(<GooglePublisherTagsSnippet active={false} />));
});

function snapshotTest(component) {
    it('is rendered correctly', () => expect(renderer.create(component).toJSON()).toMatchSnapshot());
}
