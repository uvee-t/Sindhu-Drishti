import React, { useState } from "react";
import { districts, vehicles, availableSkills } from "../data/districts";
import "./VolunteerRegistration.css";

const API_URL = "http://localhost:3000/api/alert/volunteer";

const INITIAL_FORM = {
  name: "",
  email: "",
  skills: [],
  latitude: "",
  longitude: "",
  availability: true,
  district: "",
  vehicle: ""
};

export default function VolunteerRegistration() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const clearMessages = () => {
    setSuccess("");
    setError("");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));

    setErrors((current) => ({
      ...current,
      [name]: ""
    }));

    clearMessages();
  };

  const addSkill = (skill) => {
    const value = skill.trim();
    if (!value) return;

    if (form.skills.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setSkillInput("");
      return;
    }

    setForm((current) => ({
      ...current,
      skills: [...current.skills, value]
    }));

    setSkillInput("");
    setErrors((current) => ({ ...current, skills: "" }));
    clearMessages();
  };

  const removeSkill = (skill) => {
    setForm((current) => ({
      ...current,
      skills: current.skills.filter((item) => item !== skill)
    }));
    clearMessages();
  };

  const handleSkillKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      addSkill(skillInput);
    }
  };

  const useCurrentLocation = () => {
    clearMessages();

    if (!navigator.geolocation) {
      setError("GPS is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setForm((current) => ({
          ...current,
          latitude: coords.latitude.toFixed(6),
          longitude: coords.longitude.toFixed(6)
        }));

        setErrors((current) => ({
          ...current,
          latitude: "",
          longitude: ""
        }));
      },
      (locationError) => {
        const messages = {
          1: "Location permission was denied. Please enter coordinates manually.",
          2: "Your current location could not be determined.",
          3: "GPS request timed out. Please try again."
        };

        setError(messages[locationError.code] || "Unable to get your current location.");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const validate = () => {
    const nextErrors = {};
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name) {
      nextErrors.name = "Name is required.";
    } else if (name.length < 2) {
      nextErrors.name = "Name must contain at least 2 characters.";
    }

    if (!email) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (form.skills.length === 0) {
      nextErrors.skills = "Add at least one skill.";
    }

    const latitude = Number(form.latitude);
    if (form.latitude === "") {
      nextErrors.latitude = "Latitude is required.";
    } else if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      nextErrors.latitude = "Latitude must be between -90 and 90.";
    }

    const longitude = Number(form.longitude);
    if (form.longitude === "") {
      nextErrors.longitude = "Longitude is required.";
    } else if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
      nextErrors.longitude = "Longitude must be between -180 and 180.";
    }

    if (!form.district) nextErrors.district = "Select a district.";
    if (!form.vehicle) nextErrors.vehicle = "Select a vehicle.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    clearMessages();

    if (!validate()) return;

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      skills: form.skills,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      availability: true,
      district: form.district,
      vehicle: form.vehicle
    };

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      let data = {};
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = text ? { message: text } : {};
      }

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      setSuccess(data.message || "Volunteer registration successful!");
      setForm(INITIAL_FORM);
      setSkillInput("");
      setErrors({});
    } catch (submitError) {
      if (submitError instanceof TypeError) {
        setError(
          "Could not connect to the server. Make sure your backend is running on http://localhost:3000."
        );
      } else {
        setError(submitError.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <div className="background-glow glow-one" />
      <div className="background-glow glow-two" />

      <div className="container">
        <header className="hero">
          <div className="badge">VOLUNTEER REGISTRATION</div>
          <h1>Join the Response Team</h1>
          <p>
            Register as a volunteer and help provide assistance during
            emergencies and disaster response operations.
          </p>
        </header>

        <form className="card" onSubmit={handleSubmit} noValidate>
          <section className="section">
            <div className="section-title">
              <div className="number">01</div>
              <div>
                <h2>Personal Information</h2>
                <p>Tell us a little about yourself.</p>
              </div>
            </div>

            <div className="grid two">
              <Field label="Full Name" required error={errors.name}>
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  className={errors.name ? "invalid" : ""}
                />
              </Field>

              <Field label="Email Address" required error={errors.email}>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={errors.email ? "invalid" : ""}
                />
              </Field>
            </div>
          </section>

          <section className="section">
            <div className="section-title">
              <div className="number">02</div>
              <div>
                <h2>Your Skills</h2>
                <p>Add skills that can help during disaster response.</p>
              </div>
            </div>

            <Field label="Skills" required error={errors.skills}>
              <div className={`skill-box ${errors.skills ? "invalid-box" : ""}`}>
                {form.skills.map((skill) => (
                  <span className="chip" key={skill}>
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      aria-label={`Remove ${skill}`}
                    >
                      ×
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  value={skillInput}
                  onChange={(event) => setSkillInput(event.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder={
                    form.skills.length
                      ? "Add another skill..."
                      : "Type a skill and press Enter"
                  }
                />
              </div>

              <div className="suggestions">
                {availableSkills
                  .filter(
                    (skill) =>
                      !form.skills.some(
                        (selected) =>
                          selected.toLowerCase() === skill.toLowerCase()
                      )
                  )
                  .slice(0, 6)
                  .map((skill) => (
                    <button
                      type="button"
                      key={skill}
                      onClick={() => addSkill(skill)}
                    >
                      + {skill}
                    </button>
                  ))}
              </div>
            </Field>
          </section>

          <section className="section">
            <div className="section-title">
              <div className="number">03</div>
              <div>
                <h2>Location</h2>
                <p>Help coordinators find nearby volunteers.</p>
              </div>
            </div>

            <button type="button" className="gps" onClick={useCurrentLocation}>
              <span className="gps-icon">⌖</span>
              Use My Current Location
            </button>

            <div className="or">
              <span>OR ENTER MANUALLY</span>
            </div>

            <div className="grid two">
              <Field label="Latitude" required error={errors.latitude}>
                <input
                  name="latitude"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  placeholder="27.090307"
                  value={form.latitude}
                  onChange={handleChange}
                  className={errors.latitude ? "invalid" : ""}
                />
              </Field>

              <Field label="Longitude" required error={errors.longitude}>
                <input
                  name="longitude"
                  type="number"
                  step="any"
                  inputMode="decimal"
                  placeholder="88.374195"
                  value={form.longitude}
                  onChange={handleChange}
                  className={errors.longitude ? "invalid" : ""}
                />
              </Field>
            </div>
          </section>

          <section className="section">
            <div className="section-title">
              <div className="number">04</div>
              <div>
                <h2>Availability & Resources</h2>
                <p>Tell us where you belong and what you can bring.</p>
              </div>
            </div>

            <div className="grid two">
              <Field label="District" required error={errors.district}>
                <select
                  name="district"
                  value={form.district}
                  onChange={handleChange}
                  className={errors.district ? "invalid" : ""}
                >
                  <option value="">Select your district</option>
                  {districts.map((district) => (
                    <option key={district.value} value={district.value}>
                      {district.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Vehicle" required error={errors.vehicle}>
                <select
                  name="vehicle"
                  value={form.vehicle}
                  onChange={handleChange}
                  className={errors.vehicle ? "invalid" : ""}
                >
                  <option value="">Select your vehicle</option>
                  {vehicles.map((vehicle) => (
                    <option key={vehicle} value={vehicle}>
                      {vehicle}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="availability">
              <div>
                <strong>Available for emergency response</strong>
                <span>You will be contacted when assistance is required.</span>
              </div>
              <div className="status">
                <span className="status-dot" />
                Available
              </div>
            </div>
          </section>

          {success && (
            <div className="alert success" role="status">
              <span>✓</span>
              <div>
                <strong>Registration successful</strong>
                <p>{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="alert error" role="alert">
              <span>!</span>
              <div>
                <strong>Registration failed</strong>
                <p>{error}</p>
              </div>
            </div>
          )}

          <div className="submit-area">
            <button className="submit" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Registering...
                </>
              ) : (
                <>
                  Register as Volunteer
                  <span>→</span>
                </>
              )}
            </button>
            <p>Your information will be securely submitted to the response system.</p>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({ label, required, error, children }) {
  return (
    <div className="field">
      <label>
        {label}
        {required && <span className="required">*</span>}
      </label>
      {children}
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}
