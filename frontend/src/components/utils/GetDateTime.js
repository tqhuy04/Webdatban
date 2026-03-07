export const getCurrentDateTimeVN = () => {
    const now = new Date();
    now.setHours(now.getHours() + 7); // Chỉnh sang múi giờ Việt Nam
    return now.toISOString().slice(0, 19).replace("T", " ");
};
