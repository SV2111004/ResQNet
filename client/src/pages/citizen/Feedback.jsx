import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiStar, FiSend, FiCheckCircle } from "react-icons/fi";

import DashboardLayout from "../../layouts/DashboardLayout";

const CATEGORIES = [
  "Response time",
  "App experience",
  "Responder conduct",
  "Shelter support",
  "Other",
];

// There's no feedback endpoint on the backend yet, so this submits locally
// (toast confirmation) rather than pretending to hit a real API. Once a
// service like `submitFeedback(data, token)` exists, swap the body of
// handleSubmit for that call — the form state and validation here won't
// need to change.
function Feedback() {
  const { user } = useSelector((state) => state.auth);

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    console.log("Feedback submitted:", {
      rating,
      category,
      message,
      user: user?.user?.name,
    });

    toast.success("Thanks for your feedback");
    setSubmitted(true);
    setRating(0);
    setCategory(CATEGORIES[0]);
    setMessage("");
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-display">Feedback</h1>
        <p className="text-[var(--text-muted)] mt-2 text-sm">
          Help us improve ResQNet for the next person who needs it.
        </p>
      </div>

      <div className="bg-[var(--bg-surface)] rounded-2xl p-6 sm:p-8 shadow-xl border border-[var(--border-subtle)] max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-[var(--text-secondary)] block mb-3">
              How would you rate your experience?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHoverRating(value)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1"
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                >
                  <FiStar
                    size={28}
                    className="transition-colors"
                    style={{
                      color: (hoverRating || rating) >= value ? "var(--accent-warning)" : "var(--border-strong)",
                      fill: (hoverRating || rating) >= value ? "var(--accent-warning)" : "transparent",
                    }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">What's this about?</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-[var(--bg-surface-raised)] p-3 rounded-lg border border-[var(--border-subtle)] text-white outline-none focus:border-[var(--accent-info)] transition-colors"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Your feedback</label>
            <textarea
              rows="4"
              placeholder="Tell us what went well or what we can improve…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-[var(--bg-surface-raised)] p-3 rounded-lg border border-[var(--border-subtle)] text-white outline-none focus:border-[var(--accent-info)] transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 bg-[var(--accent-info)] hover:bg-[#3d7aef] text-white font-semibold py-3.5 rounded-xl transition-colors"
          >
            {submitted ? (
              <>
                <FiCheckCircle size={18} />
                Sent — thank you
              </>
            ) : (
              <>
                <FiSend size={16} />
                Submit feedback
              </>
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default Feedback;
