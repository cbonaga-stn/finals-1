# 🌍 ITMGT 45.03 — Places API (Lab Backend)

A simple **Express + Nominatim (OpenStreetMap)** backend for geocoding and map integration demos.  
It lets you create, list, update, and delete “places,” automatically converting any address into GPS coordinates for use with **Leaflet + OpenStreetMap** maps.

---

## 🚀 Getting Started

### 1️⃣ Clone the repo

```bash
git clone https://github.com/your-username/itmgt45-03-places-api.git
cd itmgt45-03-places-api
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create your environment file

Copy the example file and edit as needed:

```bash
cp .env.example .env
```

**.env**

```
PORT=5000
NOMINATIM_BASE=https://nominatim.openstreetmap.org
GEOCODER_USER_AGENT=ITMGT-45.03-Backend-Lab/1.0 (student@obf.ateneo.edu)
```

> 💡 Use a descriptive `GEOCODER_USER_AGENT` — it’s required by Nominatim policy.
> No API key is needed; this project uses free OpenStreetMap services.

---

## ▶️ Running the Server

Start the API (development mode):

```bash
node app.js
```

You should see:

```
API running on http://localhost:5000
```

---

## 🧭 API Routes

| Method     | Endpoint                | Description                    |
| :--------- | :---------------------- | :----------------------------- |
| **GET**    | `/api/places/:pid`      | Get place by ID                |
| **GET**    | `/api/places/user/:uid` | Get all places by user         |
| **POST**   | `/api/places`           | Create new place (geocoded)    |
| **PATCH**  | `/api/places/:pid`      | Update place title/description |
| **DELETE** | `/api/places/:pid`      | Delete a place                 |
| **GET**    | `/api/users`            | List users                     |
| **POST**   | `/api/users/signup`     | Register new user              |
| **POST**   | `/api/users/login`      | Log in existing user           |

---

## 🧪 Quick Test (Geocoding)

Use curl or Postman to create a place:

```bash
curl -X POST http://localhost:5000/api/places \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Rizal Library",
    "description": "Test pin",
    "address": "Ateneo de Manila University, Katipunan, QC",
    "creator": "u1"
  }'
```

✅ If successful, you’ll receive coordinates:

```json
{
  "place": {
    "id": "uuid-value",
    "title": "Rizal Library",
    "description": "Test pin",
    "location": { "lat": 14.6406, "lng": 121.0747 },
    "address": "Ateneo de Manila University, Katipunan, QC",
    "creator": "u1"
  }
}
```

---

## 🗺️ Frontend Demo (Optional)

To visualize the coordinates on a map, open `public/test-map.html` and paste the `lat` and `lng` values returned from the API.

```html
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
```

No API key required — keep usage light and always retain attribution.

---

## 🧩 Project Structure

```
├─ app.js
├─ .env
├─ controllers/
│   ├─ places-controllers.js
│   └─ users-controllers.js
├─ routes/
│   ├─ journal-routes.js
│   └─ users-routes.js
├─ models/
│   └─ http-error.js
└─ util/
    └─ geocode.js
```

---