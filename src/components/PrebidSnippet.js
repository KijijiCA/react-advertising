/**
 * PrebidSnippet.js
 *
 * (C) 2017 mobile.de GmbH
 *
 * @author <a href="mailto:pahund@team.mobile.de">Patrick Hund</a>
 * @since 09 Aug 2017
 */

import PropTypes from 'prop-types';
import React from 'react';

function PrebidSnippet({ active, scriptPath }) {
    const loadPrebidScriptTag = active ? <script async src={scriptPath} /> : null;
    return (
        <div>
            {loadPrebidScriptTag}
            <script
                dangerouslySetInnerHTML={{
                    __html: 'var pbjs=pbjs||{};pbjs.que=pbjs.que||[]'
                }}
            />
        </div>
    );
}

PrebidSnippet.propTypes = {
    active: PropTypes.bool,
    scriptPath: PropTypes.string.isRequired
};

export default PrebidSnippet;
