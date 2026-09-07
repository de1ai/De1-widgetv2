export const isItemAllowed = (itemId, items) => {
    if (items?.allow?.length) {
        return items.allow.includes(itemId);
    }
    return !items?.deny?.includes(itemId);
};
//# sourceMappingURL=item.js.map