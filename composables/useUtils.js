export default function useUtils() {
  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = monthNames[date.getMonth()];

    const day = date.getDate();

    const year = date.getFullYear();

    const formattedDate = `${month} ${day}, ${year}`;
    if (dateString && dateString.includes("T")) {
      let hours = date.getHours();
      const minutes = date.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";

      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      const formattedTime = `${hours}:${minutes
        .toString()
        .padStart(2, "0")} ${ampm}`;

      return `${formattedDate} at ${formattedTime}`;
    }

    return formattedDate;
  };

  return {
    formatDate,
  };
}
