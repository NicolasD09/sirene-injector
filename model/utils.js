function cleanValue(value, type = "string") {
    if (value === "" || value === undefined || value === null) {
        return null;
    }
    try {
        if (type === "date") {
            const date = new Date(value);
            return isNaN(date.getTime()) ? null : date;
        }
    } catch (error) {
        return null;
    }
    return value;
}

function removeEmpty(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null));
}

module.exports = { cleanValue, removeEmpty };
