import { format } from 'date-fns';

const convertDateToDateTime = (dateString) => {
    if (!dateString) return null;

    const date = new Date(dateString);
    const formattedDate = format(date, "yyyy-MM-dd HH:mm:ss");

    return formattedDate;
};

export default convertDateToDateTime;