export const putDateOnPattern = (date) => {
    if (!date) return ''; // Return empty string if date is null or undefined
  
    const parsedDate = new Date(date);
    
    if (isNaN(parsedDate.getTime())) {
      return ''; // Return empty string if parsedDate is invalid
    }
  
    // Format day, month, and year
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = parsedDate.getFullYear();
  
    // Format hours and minutes
    const hours = String(parsedDate.getHours()).padStart(2, '0');
    const minutes = String(parsedDate.getMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year} às ${hours}:${minutes}`;
  };