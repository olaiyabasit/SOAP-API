const express = require("express");
const axios = require("axios");
const xml2js = require("xml2js");

const app = express();
const PORT = 3000;

// SOAP 1.2 request for GetSearch_WithPhone
const getSearchWithPhoneRequestBody = (
  phoneNumber
) => `<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
  <soap12:Body>
    <GetSearch_WithPhone xmlns="http://tempuri.org/">
      <PhoneNo>${phoneNumber}</PhoneNo>
    </GetSearch_WithPhone>
  </soap12:Body>
</soap12:Envelope>
`;

// SOAP 1.2 request for GetSearch_WithPhoneAndMoreDetails
const getSearchWithPhoneAndMoreDetailsRequestBody = (
  phoneNumber
) => `<?xml version="1.0" encoding="utf-8"?>
  <soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">
    <soap12:Body>
      <GetSearch_WithPhoneAndMoreDetails xmlns="http://tempuri.org/">
        <PhoneNo>${phoneNumber}</PhoneNo>
      </GetSearch_WithPhoneAndMoreDetails>
    </soap12:Body>
  </soap12:Envelope>
`;

// Route for GetSearch_WithPhone
app.get("/search-phone/:phoneNumber", async (req, res) => {
  const phoneNumber = req.params.phoneNumber; // Get phone number from URL
  const soapRequestBody = getSearchWithPhoneRequestBody(phoneNumber);

  try {
    const response = await axios.post(
      "http://41.78.157.197/WebService.asmx",
      soapRequestBody,
      {
        headers: {
          "Content-Type": "application/soap+xml; charset=utf-8",
        },
      }
    );
    // Parse the SOAP response XML
    const parser = new xml2js.Parser({
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix],
    });
    parser.parseString(response.data, (err, result) => {
      if (err) {
        return res.status(500).send("Error parsing response");
      }

      // Extract relevant data from the SOAP response
      const searchResult =
        result.Envelope.Body.GetSearch_WithPhoneResponse
          .GetSearch_WithPhoneResult;

      // Send the extracted result back as JSON
      res.json({ searchResult });
    });
  } catch (error) {
    console.error("Error making SOAP request:", error);
    res.status(500).send("Error making SOAP request");
  }
});

// Route for GetSearch_WithPhoneAndMoreDetails
app.get("/search-phone-details/:phoneNumber", async (req, res) => {
  const phoneNumber = req.params.phoneNumber; // Get phone number from URL
  const soapRequestBody =
    getSearchWithPhoneAndMoreDetailsRequestBody(phoneNumber);

  try {
    const response = await axios.post(
      "http://41.78.157.197/WebService.asmx",
      soapRequestBody,
      {
        headers: {
          "Content-Type": "application/soap+xml; charset=utf-8",
        },
      }
    );
    // Parse the SOAP response XML
    const parser = new xml2js.Parser({
      explicitArray: false,
      tagNameProcessors: [xml2js.processors.stripPrefix],
    });
    parser.parseString(response.data, (err, result) => {
      if (err) {
        return res.status(500).send("Error parsing response");
      }

      // Extract relevant data from the SOAP response
      const searchResult =
        result.Envelope.Body.GetSearch_WithPhoneAndMoreDetailsResponse
          .GetSearch_WithPhoneAndMoreDetailsResult;

      // Send the extracted result back as JSON
      res.json({ searchResult });
    });
  } catch (error) {
    console.error("Error making SOAP request:", error);
    res.status(500).send("Error making SOAP request");
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Soap APi Request!");
});
