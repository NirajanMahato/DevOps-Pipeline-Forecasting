const ResourceCard = ({ title, value, unit, color }) => (
  <div className={`rounded-2xl shadow p-4 ${color}`}>
    <h2 className="text-lg font-medium">{title}</h2>
    <p className="text-3xl font-bold">{value} <span className="text-base font-normal">{unit}</span></p>
  </div>
);

export default ResourceCard;
