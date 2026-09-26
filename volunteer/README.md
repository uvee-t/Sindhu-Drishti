# Volunteer Registration

Responsive React + Vite volunteer registration form.

## Features

- Name and email validation
- Skills as add/remove chips
- Suggested skills
- District dropdown
- Vehicle dropdown
- GPS/current-location support
- Manual latitude/longitude entry
- Coordinate range validation
- Loading state
- Success and API error messages
- Responsive mobile layout
- POST request to the volunteer API

## API

The form sends:

```json
{
  "name": "Jiya Thakur",
  "email": "tjiya918@gmail.com",
  "skills": ["First Aid", "Rescue"],
  "latitude": 27.090307,
  "longitude": 88.374195,
  "availability": true,
  "district": "1",
  "vehicle": "Bike"
}
```

to:

`POST http://localhost:3000/api/alert/volunteer`

## Run

```bash
npm install
npm run dev
```

Then open the URL printed by Vite.

## Important

Your backend must allow CORS from the Vite development server.

If your backend uses a different district list, edit:

`src/data/districts.js`

The district `value` is what gets sent to the API, while `label` is what the user sees.
