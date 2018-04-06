export default (sizeMappingName, sizeMappings) => {
    if (sizeMappingName) {
        const sizeMapping = sizeMappings && sizeMappings[sizeMappingName];

        if (sizeMapping) {
            return sizeMapping
                .map(mapping => {
                    const { viewPortSize: [minWidth], sizes } = mapping;
                    return { minWidth, sizes };
                })
                .sort((m1, m2) => m2.minWidth - m1.minWidth);
        }
    }
    return null;
};
