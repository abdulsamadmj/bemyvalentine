// App.tsx
import React, { useState, useCallback, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useLocation,
  useSearchParams,
  Link,
  Navigate,
} from "react-router-dom";
import confetti from "canvas-confetti";
import { Heart } from "lucide-react";
import catJumping from "./assets/cat.gif";
import catPlease from "./assets/cat-please.gif";
import catSad from "./assets/cat-sad.jpg";
import dogJumping from "./assets/dog-jumping.gif";
import dogPlease from "./assets/dog-please.gif";
import dogSad from "./assets/dog-sad.gif";
import CreateForm from "./form/createForm";
import { supabase } from "./utils/supabaseClient";
import { toast } from "react-toastify";

// ---- Your common Layout component ----
const Layout = ({
  children,
  gif,
}: {
  children: React.ReactNode;
  gif: string;
}) => (
  <div className="min-h-screen bg-gradient-to-br from-pink-100 to-red-50 flex items-center justify-center p-4">
    {/* Animated hearts */}
    <div className="absolute top-10 left-10 animate-pulse">
      <Heart className="w-8 h-8 text-pink-400" fill="currentColor" />
    </div>
    <div className="absolute top-20 right-20 animate-pulse delay-75">
      <Heart className="w-6 h-6 text-red-400" fill="currentColor" />
    </div>
    <div className="absolute bottom-10 left-20 animate-pulse delay-150">
      <Heart className="w-10 h-10 text-pink-300" fill="currentColor" />
    </div>
    <div className="absolute bottom-20 right-10 animate-pulse delay-200">
      <Heart className="w-7 h-7 text-red-300" fill="currentColor" />
    </div>
    <div className="max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-pink-600 mb-6">
        Will you be my Valentine? 💝
      </h1>
      <div className="w-full aspect-square mb-8 rounded-lg overflow-hidden">
        <img
          src={gif}
          alt="Valentine's Day"
          className="w-full h-full object-contain"
        />
      </div>
      {children}
    </div>
  </div>
);

// ---- Invitation Flow Components ----

const InitialChoice = ({
  yesScale,
  onNoClick,
  onYesClick,
}: {
  catPerson: boolean | null;
  yesScale: number;
  onNoClick: () => void;
  onYesClick: () => void;
}) => (
  <div className="flex items-center justify-center gap-4">
    <div className="-rotate-45 mr-10">
      <button
        onClick={onYesClick}
        style={{
          transform: `scale(${yesScale})`,
          transition: "transform 0.3s ease",
        }}
        className="heart-button relative w-20 h-20 bg-red-500 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
      >
        <p className="rotate-45 z-50">Yes! 😊</p>
      </button>
    </div>
    <button
      onClick={onNoClick}
      className="px-8 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors duration-300"
    >
      No 😢
    </button>
  </div>
);

const ThankYou = () => (
  <div className="text-center animate-fade-in">
    <p className="text-3xl font-bold text-pink-600 animate-bounce">
      Hehee, Lezz Gooo! ❤️
    </p>
  </div>
);

const DatePicker = ({
  selectedDate,
  onDateChange,
  onDateConfirm,
}: {
  selectedDate: string;
  onDateChange: (date: string) => void;
  onDateConfirm: () => void;
}) => (
  <div className="space-y-4 animate-fade-in">
    <p className="text-center text-pink-600 font-medium mb-4">
      Pick a date for our DATE! 📅
    </p>
    <input
      type="date"
      value={selectedDate}
      onChange={(e) => onDateChange(e.target.value)}
      className="w-full px-4 py-2 rounded-lg border-2 border-pink-300 focus:border-pink-500 focus:outline-none"
    />
    <button
      onClick={onDateConfirm}
      className="w-full px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
    >
      Set Date ❤️
    </button>
  </div>
);

// The Confirmation component now sends an email via MailerSend and also shows a “create your link” button.
const Confirmation = ({
  selectedDate,
}: // formRecord,
{
  selectedDate: string;
  formRecord: { email: string; name: string };
}) => {

  return (
    <div className="text-center animate-fade-in space-y-4">
      <p className="text-2xl font-bold text-pink-600 mb-2">
        Can't wait for our date! ❤️
      </p>
      <p className="text-lg text-gray-700">
        See you on{" "}
        {new Date(selectedDate).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
      {/* “Create your link” button */}
      <Link
        to="/create-form"
        className="block mt-6 px-6 py-3 bg-gray-200 text-gray-700 rounded-full font-semibold hover:bg-gray-300 transition-colors duration-300"
      >
        Create your link
      </Link>
    </div>
  );
};

// ---- Alternative UI for when there is no (or an invalid) id ----
const NoFormFound = () => (
  <div className="text-center">
    <h2 className="text-3xl font-bold text-pink-600 mb-6">
      Ask out your valentine
    </h2>
    <Link
      to="/create-form"
      className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
    >
      Get your link
    </Link>
  </div>
);

// ---- Main App Component ----
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const formId = searchParams.get("id");

  // State for the invitation flow (unchanged parts)
  const [yesScale, setYesScale] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [catPerson, setCatPerson] = useState(null);

  const gifSrc: string =
    catPerson === null
      ? selectedDate
        ? [catJumping, dogJumping].at(Math.random()) ?? catJumping
        : [catPlease, dogPlease].at(Math.random()) ?? dogPlease
      : catPerson
      ? selectedDate
        ? catJumping
        : catPlease
      : selectedDate
      ? dogJumping
      : dogPlease;

  const [gif, setGif] = useState(gifSrc);

  // State for the fetched form record from Supabase
  const [formRecord, setFormRecord] = useState<any>(null);
  const [loadingForm, setLoadingForm] = useState(true);

  // Fetch form record if "id" exists
  useEffect(() => {
    if (formId) {
      supabase
        .from("forms")
        .select("*")
        .eq("id", formId)
        .single()
        .then(({ data, error }) => {
          setCatPerson(data.catPerson);
          if (error || !data) {
            setFormRecord(null);
          } else {
            setFormRecord(data);
          }
          setLoadingForm(false);
        });
    } else {
      setLoadingForm(false);
    }
  }, [formId]);

  // Confetti and navigation for "Yes" click
  const handleNoClick = useCallback(() => {
    setYesScale((prev) => prev + 0.15);
    setGif(catPerson ? catSad : dogSad);
    setTimeout(() => setGif(gifSrc), 500);
  }, [catPerson, gifSrc]);

  const handleYesClick = useCallback(() => {
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min;

    const runConfetti = () => {
      const particleCount = 100;
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#ff0000", "#ff69b4", "#ff1493", "#ff007f", "#ffffff"],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#ff0000", "#ff69b4", "#ff1493", "#ff007f", "#ffffff"],
      });
    };

    runConfetti();
    setTimeout(runConfetti, 100);
    setTimeout(runConfetti, 200);

    navigate("/hehe?id=" + formId);
    setTimeout(() => {
      navigate("/date-picker?id=" + formId);
    }, 3000);
  }, [navigate]);

  const handleDateConfirm = async () => {
    if (selectedDate) {
      // Update the form record with the selected date
      const { error } = await supabase
        .from("forms")
        .update({ response: selectedDate })
        .eq("id", formId);

      if (error) {
        console.error("Error updating date:", error);
        toast.error("Error Updating date:" + error);
        return;
      }

      navigate("/see-ya?id=" + formId);
    }
  };

  useEffect(() => {
    if (location.pathname === "/hehe" || location.pathname === "/see-ya")
      setGif(catPerson ? catJumping : dogJumping);
    else setGif(gifSrc);
  }, [location.pathname, catPerson, gifSrc]);

  // While loading the form record, you might show a spinner.
  if (loadingForm) {
    return (
      <Layout gif={gif}>
        <div className="text-center">Loading...</div>
      </Layout>
    );
  }

  // If no id or an invalid id is provided, show alternative UI.
  if ((!formId || !formRecord) && location.pathname != "/create-form") {
    return (
      <Layout gif={gif}>
        <NoFormFound />
      </Layout>
    );
  }

  // Otherwise, show the invitation flow routes.
  return (
    <Layout gif={gif}>
      <Routes>
        <Route
          path="/"
          element={
            <InitialChoice
              catPerson={catPerson}
              yesScale={yesScale}
              onNoClick={handleNoClick}
              onYesClick={handleYesClick}
            />
          }
        />
        <Route path="/hehe" element={<ThankYou />} />
        <Route
          path="/date-picker"
          element={
            <DatePicker
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onDateConfirm={handleDateConfirm}
            />
          }
        />
        <Route
          path="/see-ya"
          element={
            <Confirmation selectedDate={selectedDate} formRecord={formRecord} />
          }
        />
        <Route path="/create-form" element={<CreateForm />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

// Wrap the app with BrowserRouter
const AppWrapper = () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

export default AppWrapper;
