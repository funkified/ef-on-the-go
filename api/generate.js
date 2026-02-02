function scoreFor(category) {
  if (["restaurantes", "colmados", "clinicas"].includes(category)) return 3;
  if (["barberias", "ferreterias", "talleres"].includes(category)) return 2;
  return 1;
}

function makeId(prefix, i) {
  return `${prefix}-${String(i).padStart(3, "0")}`;
}

// Seed demo leads (replace later with real ingestion/sources)
const SEED = [
  { municipio: "Isabela", category: "colmados", name: "Colmado Vista al Mar Bar&Grill", phone: "+1 939-202-3423", url: "https://facebook.com/ColmadoVistaalMar" },
  { municipio: "Aguadilla", category: "restaurantes", name: "Casa Juan Bosco (Restaurante/Evento)", phone: "+1 787-882-7027", url: "https://casajuanbosco.org/es/inicio/" },
  { municipio: "Arecibo", category: "ferreterias", name: "Ferretería Demo Norte", phone: "+1 787-000-0000", url: "https://example.com" },
  { municipio: "San Juan", category: "clinicas", name: "Clínica Demo Metro", phone: "+1 787-111-1111", url: "https://example.com" },
  { municipio: "Mayagüez", category: "barberias", name: "Barbería Demo Oeste", phone: "+1 787-222-2222", url: "https://example.com" }
];

const ZONES = {
  metro: ["San Juan", "Guaynabo", "Bayamón", "Carolina", "Trujillo Alto", "Cataño"],
  norte: ["Arecibo", "Hatillo", "Camuy", "Manatí", "Vega Baja", "Vega Alta", "Dorado"],
  oeste: ["Aguadilla", "Isabela", "Moca", "San Sebastián", "Mayagüez", "Rincón", "Cabo Rojo"],
  sur: ["Ponce", "Juana Díaz", "Coamo", "Santa Isabel", "Guayama", "Salinas"],
  este: ["Humacao", "Fajardo", "Luquillo", "Río Grande", "Yabucoa"],
  centro: ["Caguas", "Cayey", "Aibonito", "Orocovis", "Utuado", "Jayuya", "Barranquitas"]
};

function filterSeed(zone, category) {
  let items = [...SEED];

  if (category && category !== "mixed_top") {
    items = items.filter(x => x.category === category);
  } else if (category === "mixed_top") {
    items.sort((a, b) => scoreFor(b.category) - scoreFor(a.category));
  }

  if (zone && zone !== "mezclado" && ZONES[zone]) {
    items = items.filter(x => ZONES[zone].includes(x.municipio));
  }

  if (items.length === 0) items = [...SEED];
  return items;
}

function toMorningPack(leads) {
  const date = new Date().toLocaleDateString("es-PR", { year: "numeric", month: "short", day: "2-digit" });
  let out = `[MORNING PACK] Leads B2B — ${date}\n\n`;
  for (const l of leads) {
    out += `[LEAD] ${l.lead_name} — ${l.municipio}\n`;
    out += `ID: ${l.lead_id}\n`;
    out += `📞 ${l.phone || "pendiente"}\n`;
    if (l.url) out += `🌐 ${l.url}\n`;
    out += `📞 Hora llamada realizada: ____:____\n`;
    out += `✅ Resultado: ☐ Contestó ☐ No contestó ☐ Dejé msg ☐ Pidieron info ☐ Cita\n`;
    out += `➡️ Próximo paso: ____\n`;
    out += `🧠 Score: ${l.score} | Fuente: Seed (demo)\n`;
    out += `---\n\n`;
  }
  return out.trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { zone = "mezclado", category = "mixed_top", n = 25 } = req.body || {};
    const count = Math.max(1, Math.min(200, Number(n) || 25));

    const filtered = filterSeed(zone, category);
    const prefix =
      zone === "metro" ? "PR-MET" :
      zone === "norte" ? "PR-NOR" :
      zone === "oeste" ? "PR-OES" :
      zone === "sur" ? "PR-SUR" :
      zone === "este" ? "PR-EST" :
      zone === "centro" ? "PR-CEN" : "PR-PR";

    const leads = [];
    for (let i = 1; i <= count; i++) {
      const base = filtered[(i - 1) % filtered.length];
      leads.push({
        lead_id: makeId(prefix, i),
        lead_name: base.name,
        municipio: base.municipio,
        phone: base.phone,
        url: base.url,
        status: "🆕 Nuevo",
        owner: null,
        score: scoreFor(base.category),
        product_focus: ["Solar", "ADT"]
      });
    }

    return res.status(200).json({
      ok: true,
      zone,
      category,
      n: count,
      leads,
      morning_pack: toMorningPack(leads)
    });
  } catch (e) {
    console.log("GEN_ERROR", e);
    return res.status(500).json({ error: "Server error", details: String(e) });
  }
}
