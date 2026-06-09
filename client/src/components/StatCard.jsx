function StatCard({
  title,
  value
}) {
  return (
    <div className="bg-slate-900 rounded-lg p-5">

      <p className="text-slate-400">
        {title}
      </p>

      <h2 className="text-3xl font-bold mt-2">
        {value}
      </h2>

    </div>
  );
}

export default StatCard;