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

PrebidSnippet.defaultProps = {
    active: true
};

export default PrebidSnippet;
