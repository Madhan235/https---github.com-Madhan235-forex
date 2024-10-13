import db from "../db.js";

const convertDateFormat = (date) => {
  const [day, month, year] = date.split(".");
  return `${year}-${month}-${day}`;
};

export const getAverage = async (req, res) => {
  try {
    let { from, start, end } = req.query;

    if (!from || !start || !end) {
      return res
        .status(400)
        .json("Kindly provide valid information to process");
    }

    const validCurrencies = ["usd", "gbp", "euro"];
    const currencyColumn = from.toLowerCase();

    if (!validCurrencies.includes(currencyColumn)) {
      return res.status(400).json({ message: "Invalid currency provided" });
    }

    start = convertDateFormat(start);
    end = convertDateFormat(end);

    const query = `
      SELECT AVG(${currencyColumn}) AS average_rate
      FROM conversions
      WHERE date BETWEEN ? AND ?;
    `;
    console.log("i m fine ");

    db.query(query, [start, end], (error, results) => {
      if (error) {
        return res.status(500).json({ error: "Error retrieving data" });
      }

      if (results.length > 0) {
        const averageRate = results[0].average_rate;
        res.status(200).json({
          from,
          to: "INR",
          start,
          end,
          averageRate: averageRate || "No data available for this period",
        });
      } else {
        res.status(404).json({ message: "No data found" });
      }
    });
  } catch (error) {
    console.log("Error fetching average rate:", error);
    res.status(500).json({ error: "Server error" });
  }
};
