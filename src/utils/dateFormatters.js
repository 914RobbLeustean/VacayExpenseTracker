export const formatDate = (date, simple = false) => {
    if (!date) return '';
    
    const dateObj = new Date(date);
    
    if (simple) {
      return dateObj.toLocaleDateString('en-US');
    }
    
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };