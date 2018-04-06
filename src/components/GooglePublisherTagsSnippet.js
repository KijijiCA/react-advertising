/**
 * GooglePublisherTagsSnippet.js
 *
 * (C) 2017 mobile.de GmbH
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 07 Jul 2017
 */

import PropTypes from 'prop-types';
import React from 'react';

function GooglePublisherTagsSnippet({ active }) {
    const loadGptScriptTag = active ? <script async src="//www.googletagservices.com/tag/js/gpt.js" /> : null;
    return (
        <div>
            {loadGptScriptTag}
            <script
                dangerouslySetInnerHTML={{
                    __html: 'var googletag=googletag||{};googletag.cmd=googletag.cmd||[]'
                }}
            />
        </div>
    );
}

GooglePublisherTagsSnippet.propTypes = {
    active: PropTypes.bool
};

export default GooglePublisherTagsSnippet;
