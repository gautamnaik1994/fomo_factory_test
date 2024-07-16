function formatDate(utcTimeString: string): string {
    const utcDate: Date = new Date(utcTimeString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    };
    const formattedDate: string = utcDate.toLocaleDateString(undefined, dateOptions);
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    const formattedTime: string = utcDate.toLocaleTimeString(undefined, timeOptions);
    const formattedDateTime: string = `${formattedDate} ${formattedTime}`;
    return formattedDateTime;
}
  
export { formatDate };