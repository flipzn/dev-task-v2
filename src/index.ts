import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

// Define types for the lead data
interface Product {
  name: string;
}

interface Lead {
  phone: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  street?: string;
  housenumber?: string;
  postcode?: string;
  city?: string;
  country?: 'de' | 'at' | 'ch' | string;
}

interface LeadAttributes {
  [key: string]: any;
}

interface MetaAttributes {
  [key: string]: any;
}

interface TransformedLead {
  lead: Lead;
  product: Product;
  lead_attributes?: LeadAttributes;
  meta_attributes?: MetaAttributes;
}

interface IncomingLead {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  zipcode: string;
  created_at: Number;
  lead_type: string;
  comment: string;
  questions: {
    [key: string]: string;
  };
}

const app = express();
const port = 3000;

app.use(bodyParser.json());

// This is a simplified in-memory store for the leads that have been processed.
const processedLeads: TransformedLead[] = [];

app.get("/processedleads", (req: Request, res: Response) => {
  res.json(processedLeads);
});

app.post('/leads', async (req: Request, res: Response) => {
  const lead: IncomingLead = req.body;

  console.log('Received lead:', lead)

  let zipcode: string = process.env.TEST_POSITIVE ? "66666" : lead?.zipcode
  const isHouseOwner = process.env.TEST_POSITIVE ? true : lead.questions["Sind Sie Eigentümer der Immobilie?"] === "Ja" || "true" ? true : false

  // 1. Filter the lead data
  if (zipcode.startsWith("66") && isHouseOwner) {
    // 2. Transform the data
    const transformedLead: TransformedLead = {
      lead: {
        email: lead.email,
        first_name: lead.first_name,
        last_name: lead.last_name,
        street: lead.street ?? "",
        postcode: zipcode,
        housenumber: "15",
        city: lead.city,
        phone: lead.phone,
        country: "de"
      },
      product: {
        name: "Solaranlagen",
      },
      lead_attributes: {
        solar_energy_consumption: "1",
        solar_monthly_electricity_bill: "1",
        solar_offer_type: "Beides interessant",
        solar_owner: "Ja",
        solar_power_storage: "Ja",
        solar_property_type: "Einfamilienhaus",
        solar_roof_age: "Gerade erst gebaut",
        solar_roof_condition: "Frisch renoviert",
        solar_roof_material: "Asbest",
        solar_roof_type: "Flachdach",
        solar_south_location: "Ja",
        solar_usage: "Eigenverbrauch",
        source: "",
        solar_area: 100,

        haushaltsnettoeinkommen: 0,
        baujahr: 1998,
        immobilientyp: ["haus"],
      },
      meta_attributes: {
        landingpage_url: "",
        unique_id: "",
        utm_campaign: "",
        utm_content: "",
        utm_medium: "",
        utm_placement: "",
        utm_source: "",
        utm_term: "",
        ip: "",
        browser: "",
        optin: "",
        optin_wording: "",
        optin_wording_2: "",
      },
    };

    console.log('Transformed lead:', transformedLead)


    // 3. Send the transformed data to the second API
    const response = await fetch('https://contactapi.static.fyi/lead/receive/fake/cran/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer FakeCustomerToken',
      },
      body: JSON.stringify(transformedLead),
    });

    const responseBody = await response.json();

    
    console.log('Response status:', response.status);
    console.log('Response body:', responseBody);


    if (response.ok) {
      processedLeads.push(transformedLead);
      console.log('Lead processed and sent successfully')
      res.status(200).send('Lead processed and sent successfully');
    } else {
      console.log('Failed to send lead to second API')
      res.status(500).send('Failed to send lead to second API');
    }
  } else {
    console.log('Lead does not meet the criteria')
    res.status(200).send('Lead does not meet the criteria');
  }
});


app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});