

export default function StatCard({ icon: Icon, label, value, colorVar }) {

     return (
    <div className="relative overflow-hidden rounded-2xl p-4 hover:shadow-md">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `rgb(var(--color-${colorVar}))`, color: "#fff" }}>
          <Icon size={16} />
        </div>
        <span className="text-xs font-bold uppercase">{label}</span>
      </div>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
  
}
