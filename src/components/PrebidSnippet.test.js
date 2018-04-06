/**
 * PrebidSnippet.test.js
 *
 * (C) 2017 mobile.de GmbH
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 31 Aug 2017
 */
import React from 'react';
import PrebidSnippet from './PrebidSnippet';
import renderer from 'react-test-renderer';

describe('[@mt-advertising/components/PrebidSnippet]', () =>
    describe('The PrebidSnippet component', () => {
        describe('with just a mount point', () => snapshotTest(<PrebidSnippet scriptPath="path/to/my/script.js" />));
        describe('with active prop set', () =>
            snapshotTest(<PrebidSnippet scriptPath="path/to/my/script.js" active />));
    }));

function snapshotTest(component) {
    it('is rendered correctly', () => expect(renderer.create(component).toJSON()).toMatchSnapshot());
}
