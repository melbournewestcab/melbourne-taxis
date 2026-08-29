import React, { useState, useEffect, useCallback } from "react";

const ADMIN_SECRET_KEY = "bmt_owner_secret";

interface VisitorRow {
  id: number;
  ip: string;
  page: string;
  referrer: string;
  userAgent: string;
  timestamp: string;
}

interface PageStat {
  page: string;
  visits: number;
}

interface AdminData {
  total: number;
  uniqueIps: number;
  topPages: PageStat[];
  visitors: VisitorRow[];
}

function parseDevice(ua: string): string {
  if (!ua) return "Unknown";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return "Android";
  if (/Windows/.test(ua)) return "Windows";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Other";
}

function parseBrowser(ua: string): string {
  if (!ua) return "Unknown";
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Chrome\//.test(ua) && !/Chromium/.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua) && !/Chrome/.test(ua)) return "Safari";
  return "Other";
}

function formatTime(ts: string): string {
  try {
    return new Date(ts).toLocaleString("en-AU", {
      timeZone: "Australia/Melbourne",
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return ts;
  }
}

export default function OwnerDashboard() {
  const [secret, setSecret] = useState(() => sessionStorage.getItem(ADMIN_SECRET_KEY) || "");
  const [input, setInput] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const limit = 50;

  const fetchData = useCallback(async (sec: string, pg: number) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/visitors/?secret=${encodeURIComponent(sec)}&page=${pg}&limit=${limit}`);
      if (res.status === 401) {
        setError("Wrong password.");
        setSecret("");
        sessionStorage.removeItem(ADMIN_SECRET_KEY);
        setLoading(false);
        return;
      }
      const json = await res.json();
      setData(json);
    } catch {
      setError("Failed to load data.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (secret) fetchData(secret, page);
  }, [secret, page, fetchData]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    sessionStorage.setItem(ADMIN_SECRET_KEY, input);
    setSecret(input);
    setInput("");
  }

  if (!secret) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#111" }}>
        <form onSubmit={handleLogin} style={{ background: "#1a1a1a", border: "2px solid #f97316", borderRadius: 12, padding: 40, minWidth: 320 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔐</div>
            <div style={{ color: "#f97316", fontWeight: 700, fontSize: 20 }}>Owner Access</div>
            <div style={{ color: "#888", fontSize: 13, marginTop: 4 }}>Bacchus Marsh Taxi — Admin</div>
          </div>
          <input
            type="password"
            placeholder="Enter password"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
            style={{
              width: "100%", padding: "10px 14px", borderRadius: 6,
              border: "1px solid #333", background: "#111", color: "#fff",
              fontSize: 15, marginBottom: 12, boxSizing: "border-box",
            }}
          />
          {error && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 10 }}>{error}</div>}
          <button type="submit" style={{
            width: "100%", padding: "10px 0", background: "#f97316", color: "#fff",
            border: "none", borderRadius: 6, fontWeight: 700, fontSize: 15, cursor: "pointer",
          }}>
            Sign In
          </button>
        </form>
      </div>
    );
  }

  const filtered = (data?.visitors ?? []).filter(v =>
    !search || v.ip.includes(search) || v.page.includes(search) || v.referrer.includes(search)
  );

  const totalPages = data ? Math.ceil(data.total / limit) : 1;

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f0f", color: "#e5e5e5", fontFamily: "system-ui, sans-serif", padding: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f97316" }}>
            🚖 Visitor Dashboard
          </h1>
          <div style={{ color: "#666", fontSize: 13, marginTop: 2 }}>Bacchus Marsh Taxi — Owner Only</div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={() => fetchData(secret, page)} style={{
            padding: "7px 16px", background: "#1f1f1f", color: "#ccc",
            border: "1px solid #333", borderRadius: 6, cursor: "pointer", fontSize: 13,
          }}>↻ Refresh</button>
          <button onClick={() => { sessionStorage.removeItem(ADMIN_SECRET_KEY); setSecret(""); }} style={{
            padding: "7px 16px", background: "#1f1f1f", color: "#f87171",
            border: "1px solid #333", borderRadius: 6, cursor: "pointer", fontSize: 13,
          }}>Sign Out</button>
        </div>
      </div>

      {loading && !data && (
        <div style={{ textAlign: "center", padding: 60, color: "#666" }}>Loading...</div>
      )}

      {data && (
        <>
          {/* Stats cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
            {[
              { label: "Total Visits", value: data.total.toLocaleString(), icon: "👁" },
              { label: "Unique IPs", value: data.uniqueIps?.toLocaleString() ?? "—", icon: "🌐" },
              { label: "Pages Tracked", value: data.topPages?.length ?? "—", icon: "📄" },
            ].map(card => (
              <div key={card.label} style={{
                background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10,
                padding: "16px 20px",
              }}>
                <div style={{ fontSize: 22, marginBottom: 6 }}>{card.icon}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: "#f97316" }}>{card.value}</div>
                <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{card.label}</div>
              </div>
            ))}
          </div>

          {/* Top pages */}
          {data.topPages?.length > 0 && (
            <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, padding: 20, marginBottom: 24 }}>
              <div style={{ fontWeight: 600, marginBottom: 14, color: "#ccc", fontSize: 14 }}>Top Pages</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {data.topPages.map(p => (
                  <div key={p.page} style={{
                    background: "#111", border: "1px solid #333", borderRadius: 20,
                    padding: "4px 14px", fontSize: 13, display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <span style={{ color: "#aaa" }}>{p.page || "/"}</span>
                    <span style={{ background: "#f97316", color: "#fff", borderRadius: 10, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>{p.visits}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div style={{ marginBottom: 14 }}>
            <input
              placeholder="Search by IP, page, or referrer..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: "8px 14px", background: "#1a1a1a", border: "1px solid #333",
                borderRadius: 6, color: "#e5e5e5", fontSize: 13, width: "100%", maxWidth: 380,
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Visitor table */}
          <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 10, overflow: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #2a2a2a", color: "#888" }}>
                  {["#", "IP Address", "Page", "Referrer", "Device", "Browser", "Time (AEST)"].map(h => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ padding: 32, textAlign: "center", color: "#555" }}>No visits yet.</td>
                  </tr>
                )}
                {filtered.map((v, i) => (
                  <tr key={v.id} style={{ borderBottom: "1px solid #1f1f1f", background: i % 2 === 0 ? "transparent" : "#161616" }}>
                    <td style={{ padding: "10px 14px", color: "#555" }}>{(page - 1) * limit + i + 1}</td>
                    <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "#f97316", fontWeight: 600 }}>{v.ip}</td>
                    <td style={{ padding: "10px 14px", color: "#ccc", maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.page}</td>
                    <td style={{ padding: "10px 14px", color: "#888", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {v.referrer ? (
                        <a href={v.referrer} target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa", textDecoration: "none" }}>
                          {v.referrer.replace(/^https?:\/\//, "").substring(0, 40)}
                        </a>
                      ) : <span style={{ color: "#444" }}>Direct</span>}
                    </td>
                    <td style={{ padding: "10px 14px", color: "#aaa" }}>{parseDevice(v.userAgent)}</td>
                    <td style={{ padding: "10px 14px", color: "#aaa" }}>{parseBrowser(v.userAgent)}</td>
                    <td style={{ padding: "10px 14px", color: "#666", whiteSpace: "nowrap" }}>{formatTime(v.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center", justifyContent: "center" }}>
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{ padding: "6px 14px", background: "#1a1a1a", color: page === 1 ? "#444" : "#ccc", border: "1px solid #333", borderRadius: 6, cursor: page === 1 ? "default" : "pointer" }}
              >← Prev</button>
              <span style={{ color: "#666", fontSize: 13 }}>Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{ padding: "6px 14px", background: "#1a1a1a", color: page === totalPages ? "#444" : "#ccc", border: "1px solid #333", borderRadius: 6, cursor: page === totalPages ? "default" : "pointer" }}
              >Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
