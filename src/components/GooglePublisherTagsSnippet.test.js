/**
 * GooglePublisherTagsSnippet.test.js
 *
 * (C) 2017 mobile.de GmbH
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 31 Aug 2017
 */
import React from 'react';
import GooglePublisherTagsSnippet from './GooglePublisherTagsSnippet';
import renderer from 'react-test-renderer';

describe('[@mt-advertising/components/GooglePublisherTagsSnippet]', () =>
    describe('The GooglePublisherTagsSnippet component', () => {
        describe('with no props', () => snapshotTest(<GooglePublisherTagsSnippet />));
        describe('with active prop set', () => snapshotTest(<GooglePublisherTagsSnippet active />));
    }));

function snapshotTest(component) {
    it('is rendered correctly', () => expect(renderer.create(component).toJSON()).toMatchSnapshot());
}
