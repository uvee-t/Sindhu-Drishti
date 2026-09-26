# Sindhu Drishti Backend Integration

Integrated the volunteer alert workflow into the existing backend without introducing a service layer.

## New endpoints

- `POST /api/alert/volunteer` — register the authenticated user as a volunteer. District is taken from the JWT (`distCode`); it is not accepted from the request body.
- `GET /api/alert/volunteer` — return volunteers for the authenticated user's district, including coordinates.
- `POST /api/alert/send` — find available volunteers whose coordinates fall inside red zones for the authenticated district and queue an email alert for each volunteer.

Existing `/auth/*`, `/api/user/*`, and `/api/zone/*` routes were preserved.

## Database

Run `migrations/001_create_volunteers.sql` against the same PostgreSQL/PostGIS database used by the application.

The volunteer table stores:
- id
- name
- email
- skills
- latitude
- longitude
- PostGIS point (`location`)
- availability
- district (JWT `distCode`)
- vehicle
- created_at / updated_at

## Email + queue

The alert controller only performs the database lookup and enqueues jobs. BullMQ workers send the actual emails through Nodemailer.

Run the API and worker separately:

```bash
npm install
npm start
npm run worker
```

For development:

```bash
npm run dev
```

Configure SMTP values in `.env` using `.env.example` as the template. The original `.env` was intentionally not included in the integrated archive so credentials are not redistributed.
