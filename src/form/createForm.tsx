// CreateForm.tsx
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

const CreateForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Insert details into the "forms" table in Supabase
    const { data, error } = await supabase
      .from("forms")
      .insert([{ email, name }])
      .select();

    if (error || !data || data.length === 0) {
      setError("There was an error creating the form. Please try again.");
      setLoading(false);
      return;
    }

    // Use the returned id to create an affiliate link
    const formId = data[0].id;
    const link = `${window.location.origin}/?id=${formId}`;
    setAffiliateLink(link);
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pink-600 text-center">
        Create New Form
      </h2>
      {affiliateLink ? (
        <div className="text-center">
          <p className="mb-4">Your form link is ready:</p>
          <input
            type="text"
            value={affiliateLink}
            readOnly
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            {loading ? "Creating..." : "Create Form"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateForm;
