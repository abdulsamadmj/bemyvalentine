// CreateForm.tsx
import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CreateForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [catPerson, setCatPerson] = useState<boolean | null>(null);
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
      .insert([{ email, name, catPerson }])
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

  const handleCopy = () => {
    navigator.clipboard.writeText(affiliateLink);
    toast.success("Copied to Clipboard");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Be My Valentine ?',
        text: 'Would you be my Valentine?',
        url: affiliateLink,
      })
      .then(() => console.log('Successful share'))
      .catch((error) => console.log('Error sharing', error));
    } else {
      toast.error("Web Share API is not supported in your browser.");
    }
  };

  return (
    <div className="space-y-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-pink-600 text-center">
        Create New Form
      </h2>
      {affiliateLink ? (
        <div className="text-center">
          <p className="mb-4">Your form link is ready:</p>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={affiliateLink}
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
            <button onClick={handleCopy}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-copy"
              >
                <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
              </svg>
            </button>
            <button onClick={handleShare}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-square-arrow-out-up-right"
              >
                <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
                <path d="m21 3-9 9" />
                <path d="M15 3h6v6" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Your Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>
          <div>
            <label className="block text-gray-700">Valentine's Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 border border-pink-300 rounded-lg focus:outline-none focus:border-pink-500"
            />
          </div>
          {/* Radio Button to select if catPerson or not */}
          <div>
            <label className="block text-gray-700">
              Is she/he a cat or dog person?
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="petPreference"
                  value="cat"
                  checked={catPerson === true}
                  onChange={() => setCatPerson(true)}
                  className="form-radio"
                />
                <span className="ml-2">Cat Person</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="petPreference"
                  value="dog"
                  checked={catPerson === false}
                  onChange={() => setCatPerson(false)}
                  className="form-radio"
                />
                <span className="ml-2">Dog Person</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="petPreference"
                  value="both"
                  checked={catPerson === null}
                  onChange={() => setCatPerson(null)}
                  className="form-radio"
                />
                <span className="ml-2">Both</span>
              </label>
            </div>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            {loading ? "Creating..." : "Create Link"}
          </button>
        </form>
      )}
    </div>
  );
};

export default CreateForm;
