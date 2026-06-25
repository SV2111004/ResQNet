function LandingPage() {
  return (
    <div
      className="
      min-h-screen
      bg-slate-950
      text-white
      flex
      flex-col
      items-center
      justify-center
      px-6
      text-center
    "
    >
      <div className="max-w-4xl">
        <h1
          className="
          text-5xl
          md:text-6xl
          font-bold
          mb-6
        "
        >
          ResQNet
        </h1>

        <p
          className="
          text-xl
          text-slate-300
          mb-8
        "
        >
          Real-Time Disaster Response &
          Emergency Coordination Platform
        </p>

        <p
          className="
          text-slate-400
          max-w-2xl
          mx-auto
          mb-10
        "
        >
          ResQNet helps citizens report emergencies,
          enables administrators to coordinate
          rescue operations, assists responders with
          mission management, and recommends
          evacuation shelters using intelligent
          routing algorithms.
        </p>

        <div
          className="
          flex
          gap-4
          justify-center
          flex-wrap
        "
        >
          <a
            href="/login"
            className="
            bg-blue-600
            hover:bg-blue-700
            px-6
            py-3
            rounded-lg
            font-semibold
            transition
          "
          >
            Login
          </a>

          <a
            href="/register"
            className="
            border
            border-slate-600
            hover:bg-slate-800
            px-6
            py-3
            rounded-lg
            font-semibold
            transition
          "
          >
            Register
          </a>
        </div>
      </div>

      <div
        className="
        mt-20
        grid
        md:grid-cols-3
        gap-6
        max-w-5xl
        w-full
      "
      >
        <div className="bg-slate-900 p-6 rounded-xl">
          <h3 className="font-bold text-lg mb-2">
            Emergency Reporting
          </h3>

          <p className="text-slate-400">
            Citizens can report disasters and SOS
            requests with GPS location.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h3 className="font-bold text-lg mb-2">
            Rescue Coordination
          </h3>

          <p className="text-slate-400">
            Admins assign responders and manage
            missions in real time.
          </p>
        </div>

        <div className="bg-slate-900 p-6 rounded-xl">
          <h3 className="font-bold text-lg mb-2">
            Smart Routing
          </h3>

          <p className="text-slate-400">
            Dijkstra-based route optimization and
            nearest shelter recommendation.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;

