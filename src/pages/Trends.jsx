// src/pages/Trends.jsx
import { useState, useEffect, useRef } from "react";
import { fetchTrends, getTrends } from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from "recharts";

// ----------------------
// Spinner Component
// ----------------------
function Spinner() {
  return (
    <div className="w-14 h-14 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
  );
}

// ----------------------
// Full Country List
// ----------------------
const COUNTRY_LIST = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AS", name: "American Samoa" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AI", name: "Anguilla" },
  { code: "AQ", name: "Antarctica" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AW", name: "Aruba" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BM", name: "Bermuda" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" },
  { code: "IO", name: "British Indian Ocean Territory" },
  { code: "BN", name: "Brunei Darussalam" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CV", name: "Cape Verde" },
  { code: "KY", name: "Cayman Islands" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo, Democratic Republic" },
  { code: "CR", name: "Costa Rica" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "SZ", name: "Eswatini" },
  { code: "ET", name: "Ethiopia" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GF", name: "French Guiana" },
  { code: "PF", name: "French Polynesia" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GI", name: "Gibraltar" },
  { code: "GR", name: "Greece" },
  { code: "GL", name: "Greenland" },
  { code: "GD", name: "Grenada" },
  { code: "GP", name: "Guadeloupe" },
  { code: "GU", name: "Guam" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" },
  { code: "HK", name: "Hong Kong" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "Korea (North)" },
  { code: "KR", name: "Korea (South)" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Lao People's Democratic Republic" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MO", name: "Macao" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MQ", name: "Martinique" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MS", name: "Montserrat" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NC", name: "New Caledonia" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "NU", name: "Niue" },
  { code: "NF", name: "Norfolk Island" },
  { code: "MK", name: "North Macedonia" },
  { code: "MP", name: "Northern Mariana Islands" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PS", name: "Palestine" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "PR", name: "Puerto Rico" },
  { code: "QA", name: "Qatar" },
  { code: "RE", name: "Réunion" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "RW", name: "Rwanda" },
  { code: "BL", name: "Saint Barthélemy" },
  { code: "SH", name: "Saint Helena" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "MF", name: "Saint Martin (French)" },
  { code: "PM", name: "Saint Pierre and Miquelon" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SX", name: "Sint Maarten (Dutch)" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "GS", name: "South Georgia and the South Sandwich Islands" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syria" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TK", name: "Tokelau" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Türkiye" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TC", name: "Turks and Caicos Islands" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "VI", name: "Virgin Islands (U.S.)" },
  { code: "WF", name: "Wallis and Futuna" },
  { code: "EH", name: "Western Sahara" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" }
];

export default function Trends() {
  const [keywords, setKeywords] = useState(["", "", ""]);
  const [regions, setRegions] = useState(["", "", ""]);
  const [allRegionsSame, setAllRegionsSame] = useState(false);
  const [visibleFields, setVisibleFields] = useState(1);

  const [errors, setErrors] = useState(["", "", ""]);

  const [isLoading, setIsLoading] = useState(false);
  const [timeRange, setTimeRange] = useState("90d");

  const [allDataCached, setAllDataCached] = useState({});
  const [anomaliesByKw, setAnomaliesByKw] = useState({});

  const [history, setHistory] = useState([]);
  const [countrySuggestions, setCountrySuggestions] = useState([[], [], []]);
  const [activeCountryIndex, setActiveCountryIndex] = useState([-1, -1, -1]);
  const [recentDropdownOpen, setRecentDropdownOpen] = useState([-1, -1, -1]);

  const containerRef = useRef(null);

  const timeRanges = [
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "3 Months" },
    { value: "180d", label: "6 Months" },
    { value: "365d", label: "1 Year" },
    { value: "730d", label: "2 Year" },
  ];

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("trend_search_history") || "[]");
    setHistory(saved);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setRecentDropdownOpen([-1, -1, -1]);
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => document.removeEventListener("click", handleClickOutside, true);
  }, []);

  const setKeywordAt = (index, value) => {
    const cleaned = value.replace(/\s+/g, "");

    setKeywords((prev) => {
      if (cleaned && prev.some((k, i) => i !== index && k === cleaned)) {
        setErrors((old) => {
          const copy = [...old];
          copy[index] = "Duplicate keyword not allowed";
          return copy;
        });
        return prev;
      }

      setErrors((old) => {
        const copy = [...old];
        copy[index] = "";
        return copy;
      });

      const c = [...prev];
      if (prev[index] !== cleaned) {
        setAllDataCached((old) => {
          const copy = { ...old };
          delete copy[prev[index]];
          return copy;
        });
        setAnomaliesByKw((old) => {
          const copy = { ...old };
          delete copy[prev[index]];
          return copy;
        });
      }
      c[index] = cleaned;
      return c;
    });
  };

  const pushToHistory = (kw) => {
    if (!kw) return;
    setHistory((prev) => {
      const clean = prev.filter((x) => x !== kw);
      const updated = [kw, ...clean].slice(0, 50);
      localStorage.setItem("trend_search_history", JSON.stringify(updated));
      return updated;
    });
  };

  const removeRecent = (kw) => {
    setHistory((prev) => {
      const filtered = prev.filter((x) => x !== kw);
      localStorage.setItem("trend_search_history", JSON.stringify(filtered));
      return filtered;
    });
  };

  const clearHistory = () => {
    localStorage.removeItem("trend_search_history");
    setHistory([]);
  };

  const handleCountryInput = (value, idx) => {
    setRegions((prev) => {
      let copy = [...prev];
      copy[idx] = value;
      if (allRegionsSame && idx === 0) {
        copy = copy.map(() => value);
      }
      return copy;
    });

    if (!value.trim()) {
      setCountrySuggestions((prev) => {
        const copy = [...prev];
        copy[idx] = [];
        return copy;
      });

      setActiveCountryIndex((prev) => {
        const copy = [...prev];
        copy[idx] = -1;
        return copy;
      });

      return;
    }

    const filtered = COUNTRY_LIST.filter((c) =>
      c.name.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 5);

    setCountrySuggestions((prev) => {
      const copy = [...prev];
      copy[idx] = filtered;
      return copy;
    });

    setActiveCountryIndex((prev) => {
      const copy = [...prev];
      copy[idx] = -1;
      return copy;
    });
  };

  const selectCountry = (code, name, idx) => {
    setRegions((prev) => {
      let copy = [...prev];
      copy[idx] = code;
      if (allRegionsSame && idx === 0) {
        copy = copy.map(() => code);
      }
      return copy;
    });

    setCountrySuggestions((prev) => {
      const copy = [...prev];
      copy[idx] = [];
      return copy;
    });

    setActiveCountryIndex((prev) => {
      const copy = [...prev];
      copy[idx] = -1;
      return copy;
    });
  };

  const handleCountryKeyDown = (e, idx) => {
    const suggestions = countrySuggestions[idx];
    if (!suggestions.length) return;

    setActiveCountryIndex((prev) => {
      const copy = [...prev];
      if (e.key === "ArrowDown") {
        copy[idx] = Math.min(suggestions.length - 1, copy[idx] + 1);
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        copy[idx] = Math.max(0, copy[idx] - 1);
        e.preventDefault();
      } else if (e.key === "Enter" && copy[idx] >= 0) {
        selectCountry(suggestions[copy[idx]].code, suggestions[copy[idx]].name, idx);
        e.preventDefault();
      }
      return copy;
    });
  };

const filterDataByTimeRange = (data, range) => {
  if (!data?.length) return [];

  const now = new Date();
  const cutoff = new Date();

  switch (range) {
    case "7d":
      cutoff.setDate(now.getDate() - 7);
      break;
    case "30d":
      cutoff.setDate(now.getDate() - 30);
      break;
    case "90d":
      cutoff.setDate(now.getDate() - 90);
      break;
    case "180d":
      cutoff.setDate(now.getDate() - 180);
      break;
    case "365d":
      cutoff.setDate(now.getDate() - 365);
      break;
    case "730d":
      cutoff.setDate(now.getDate() - 730);
      break;
    default:
      return data; // fallback safety
  }

  return data.filter(d => new Date(d.date) >= cutoff);
};


  const getChartForKw = (kw) => {
    const raw = allDataCached[kw] || [];
    return filterDataByTimeRange(raw, timeRange).map((d) => ({
      date: d.date,
      interest: d.value,
    }));
  };

  const loadTrends = async () => {
    const newErrors = keywords
      .slice(0, visibleFields)
      .map((k) => (!k.trim() ? "Keyword is empty" : ""));
    setErrors(newErrors);
    if (newErrors.some(Boolean)) return;

    setIsLoading(true);
    try {
      const newCache = { ...allDataCached };
      const newAnoms = { ...anomaliesByKw };
      for (let i = 0; i < visibleFields; i++) {
        const kw = keywords[i];
        if (!kw) continue;
        const geo = regions[i] || "";
        await fetchTrends({ keyword: kw, geo });
        const res = await getTrends({ keyword: kw, geo });

        newCache[kw] = res.data.trends;
        newAnoms[kw] = res.data.anomalies;
        pushToHistory(kw);
      }
      setAllDataCached(newCache);
      setAnomaliesByKw(newAnoms);
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const separateCharts = keywords.slice(0, visibleFields).map((kw) => ({
    kw,
    data: getChartForKw(kw),
    anomalies: anomaliesByKw[kw] || [],
  }));

  const combinedChart = [];
  if (visibleFields > 0) {
    const length = Math.max(...separateCharts.map((sc) => sc.data.length));
    for (let i = 0; i < length; i++) {
      const point = { date: separateCharts[0]?.data[i]?.date || "" };
      separateCharts.forEach((sc) => {
        point[sc.kw] = sc.data[i]?.interest || 0;
      });
      combinedChart.push(point);
    }
  }

  const tickFormatter = (tick) => new Date(tick).toLocaleDateString();

  return (
    <div className="p-6 space-y-6 relative" ref={containerRef}>
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Spinner />
            <div className="text-gray-700 font-medium">Processing…</div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-xl p-6 space-y-4">
        {keywords.slice(0, visibleFields).map((kw, idx) => (
          <div key={idx} className="flex gap-4 items-start relative">

            {/* --------------------------- */}
            {/* KEYWORD INPUT */}
            {/* --------------------------- */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">
                Keyword {idx + 1}
              </label>
              <div className="relative w-full"> {/* fixed wrapper */}
                <input
                  value={kw}
                  onChange={(e) => setKeywordAt(idx, e.target.value)}
                  onFocus={() =>
                    setRecentDropdownOpen((prev) => prev.map((v, i) => (i === idx ? 1 : -1)))
                  }
                  className={`border rounded-lg px-3 py-2 mt-1 w-full ${
                    errors[idx] ? "border-red-500" : "border-gray-300"
                  }`}
                />

                {recentDropdownOpen[idx] === 1 && history.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border rounded-lg mt-1 shadow z-40 max-h-48 overflow-auto">
                    <div className="flex justify-between items-center px-3 py-1 border-b bg-gray-100">
                      <span className="font-semibold">Recents</span>
                      <button className="text-sm" onClick={clearHistory}>
                        Clear
                      </button>
                    </div>
                    {history.map((h) => (
                      <div
                        key={h}
                        className="flex justify-between items-center px-3 py-1 hover:bg-gray-100 cursor-pointer"
                      >
                        <span
                          onClick={() => {
                            setKeywordAt(idx, h);
                            setRecentDropdownOpen([-1, -1, -1]);
                          }}
                        >
                          {h}
                        </span>
                        <button className="text-red-500" onClick={() => removeRecent(h)}>
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors[idx] && <p className="text-red-500 text-sm mt-1">{errors[idx]}</p>}
            </div>

            {/* --------------------------- */}
            {/* REGION INPUT */}
            {/* --------------------------- */}
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700">Region</label>
              <div className="relative w-full"> {/* fixed wrapper */}
                <input
                  value={regions[idx]}
                  onChange={(e) => handleCountryInput(e.target.value, idx)}
                  onKeyDown={(e) => handleCountryKeyDown(e, idx)}
                  placeholder="Global"
                  className={`border rounded-lg px-3 py-2 mt-1 w-full ${
                    allRegionsSame && idx > 0 ? "bg-gray-100" : ""
                  }`}
                  disabled={allRegionsSame && idx > 0}
                />

                {countrySuggestions[idx]?.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border rounded-lg mt-1 shadow z-40 max-h-48 overflow-auto">
                    {countrySuggestions[idx].map((c, i) => (
                      <div
                        key={c.code}
                        className={`px-3 py-1 hover:bg-gray-100 cursor-pointer ${
                          activeCountryIndex[idx] === i ? "bg-gray-200" : ""
                        }`}
                        onClick={() => selectCountry(c.code, c.name, idx)}
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>
        ))}

        {/* Add/Remove Keywords */}
        <div className="flex gap-2 mt-2">
          {visibleFields < 3 && (
            <button
              onClick={() => setVisibleFields((v) => v + 1)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              ＋ Add
            </button>
          )}
          {visibleFields > 1 && (
            <button
              onClick={() => setVisibleFields((v) => v - 1)}
              className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Remove
            </button>
          )}
        </div>

        {/* Checkbox: All Regions Same */}
        <div className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            checked={allRegionsSame}
            onChange={(e) => {
              setAllRegionsSame(e.target.checked);
              if (e.target.checked) setRegions(regions.map(() => regions[0]));
            }}
          />
          <label>All regions are same</label>
        </div>

        {/* Time range */}
        <div className="flex flex-wrap gap-2">
          {timeRanges.map((r) => (
            <button
              key={r.value}
              onClick={() => setTimeRange(r.value)}
              className={`px-4 py-2 rounded-lg text-sm ${
                r.value === timeRange ? "bg-blue-600 text-white" : "bg-gray-100"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Analyze Button */}
        <div>
          <button
            onClick={loadTrends}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 w-full font-semibold"
          >
            Analyze
          </button>
        </div>
      </div>

            {/* Summary */}
      <div className="bg-white rounded-xl shadow p-6">
        <h4 className="font-semibold mb-4 text-lg">Trend Analysis Summary</h4>
        
        {combinedChart.length > 0 ? (
          <div className="space-y-4">
            {/* Individual Keyword Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {keywords.slice(0, visibleFields).map((kw, index) => {
                const data = getChartForKw(kw);
                if (!data.length) return null;
                
                const values = data.map(d => d.interest);
                const maxVal = Math.max(...values);
                const avgVal = values.reduce((a, b) => a + b, 0) / values.length;
                const recentCount = Math.max(1, Math.floor(values.length * 0.3));
                const recentAvg = values.slice(-recentCount).reduce((a, b) => a + b, 0) / recentCount;
                const initialAvg = values.slice(0, recentCount).reduce((a, b) => a + b, 0) / recentCount;
                const trend = recentAvg > initialAvg * 1.1 ? "upward" : 
                            recentAvg < initialAvg * 0.9 ? "downward" : "stable";
                const spikes = anomaliesByKw[kw] || [];
                const recentSpikes = spikes.filter(s => {
                  const spikeDate = new Date(s.date);
                  const cutoff = new Date();
                  cutoff.setDate(cutoff.getDate() - 30);
                  return spikeDate >= cutoff;
                }).length;

                const trendColors = {
                  upward: "text-green-600 bg-green-50",
                  downward: "text-red-600 bg-red-50", 
                  stable: "text-blue-600 bg-blue-50"
                };

                return (
                  <div key={kw} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-gray-900 text-lg">{kw}</h5>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${trendColors[trend]} flex items-center gap-1`}>
                        {trend.charAt(0).toUpperCase() + trend.slice(1)}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="bg-white rounded-lg p-3 border">
                        <div className="text-xs text-gray-500 mb-1">Average Popularity</div>
                        <div className="text-lg font-bold text-gray-900">{Math.round(avgVal)}</div>
                        <div className="text-xs text-gray-500">out of 100</div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="bg-white rounded-lg p-2 border text-center">
                          <div className="text-xs text-gray-500">Peak</div>
                          <div className="font-semibold text-gray-900">{maxVal}</div>
                        </div>
                        <div className="bg-white rounded-lg p-2 border text-center">
                          <div className="text-xs text-gray-500">Recent Spikes</div>
                          <div className={`font-semibold ${recentSpikes > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                            {recentSpikes}
                          </div>
                        </div>
                      </div>
                      
                      {recentSpikes > 0 && (
                        <div className="text-xs text-orange-600 bg-orange-50 rounded px-2 py-1 text-center">
                          {recentSpikes} spike{recentSpikes !== 1 ? 's' : ''} in last 30 days
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Comparative Analysis */}
            {visibleFields > 1 && (
              <div className="border-t pt-4 mt-4">
                <h5 className="font-semibold mb-3 text-gray-900">Comparative Analysis</h5>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-sm text-gray-700 space-y-2">
                    {(() => {
                      const comparisons = [];
                      
                      // Compare keyword 1 with keyword 2
                      if (keywords[0] && keywords[1]) {
                        const data1 = getChartForKw(keywords[0]);
                        const data2 = getChartForKw(keywords[1]);
                        if (data1.length && data2.length) {
                          const recent1 = data1.slice(-7).reduce((a, b) => a + b.interest, 0) / 7;
                          const recent2 = data2.slice(-7).reduce((a, b) => a + b.interest, 0) / 7;
                          const ratio = recent1 / recent2;
                          
                          let comparisonText = "";
                          let color = "";
                          
                          if (ratio > 1.5) {
                            comparisonText = `<strong>${keywords[0]}</strong> is significantly more popular than <strong>${keywords[1]}</strong>`;
                            color = "bg-green-500";
                          } else if (ratio < 0.67) {
                            comparisonText = `<strong>${keywords[0]}</strong> is significantly less popular than <strong>${keywords[1]}</strong>`;
                            color = "bg-red-500";
                          } else if (ratio > 1.2) {
                            comparisonText = `<strong>${keywords[0]}</strong> is more popular than <strong>${keywords[1]}</strong>`;
                            color = "bg-green-400";
                          } else if (ratio < 0.83) {
                            comparisonText = `<strong>${keywords[0]}</strong> is less popular than <strong>${keywords[1]}</strong>`;
                            color = "bg-red-400";
                          } else {
                            comparisonText = `<strong>${keywords[0]}</strong> has similar popularity to <strong>${keywords[1]}</strong>`;
                            color = "bg-blue-500";
                          }
                          
                          comparisons.push(
                            <div key="kw1-kw2" className="flex items-center">
                              <div className={`w-2 h-2 ${color} rounded-full mr-2`}></div>
                              <span dangerouslySetInnerHTML={{ __html: comparisonText }} />
                            </div>
                          );
                        }
                      }
                      
                      // Compare keyword 1 with keyword 3
                      if (keywords[0] && keywords[2]) {
                        const data1 = getChartForKw(keywords[0]);
                        const data3 = getChartForKw(keywords[2]);
                        if (data1.length && data3.length) {
                          const recent1 = data1.slice(-7).reduce((a, b) => a + b.interest, 0) / 7;
                          const recent3 = data3.slice(-7).reduce((a, b) => a + b.interest, 0) / 7;
                          const ratio = recent1 / recent3;
                          
                          let comparisonText = "";
                          let color = "";
                          
                          if (ratio > 1.5) {
                            comparisonText = `<strong>${keywords[0]}</strong> is significantly more popular than <strong>${keywords[2]}</strong>`;
                            color = "bg-green-500";
                          } else if (ratio < 0.67) {
                            comparisonText = `<strong>${keywords[0]}</strong> is significantly less popular than <strong>${keywords[2]}</strong>`;
                            color = "bg-red-500";
                          } else if (ratio > 1.2) {
                            comparisonText = `<strong>${keywords[0]}</strong> is more popular than <strong>${keywords[2]}</strong>`;
                            color = "bg-green-400";
                          } else if (ratio < 0.83) {
                            comparisonText = `<strong>${keywords[0]}</strong> is less popular than <strong>${keywords[2]}</strong>`;
                            color = "bg-red-400";
                          } else {
                            comparisonText = `<strong>${keywords[0]}</strong> has similar popularity to <strong>${keywords[2]}</strong>`;
                            color = "bg-blue-500";
                          }
                          
                          comparisons.push(
                            <div key="kw1-kw3" className="flex items-center">
                              <div className={`w-2 h-2 ${color} rounded-full mr-2`}></div>
                              <span dangerouslySetInnerHTML={{ __html: comparisonText }} />
                            </div>
                          );
                        }
                      }
                      
                      // Compare keyword 2 with keyword 3
                      if (keywords[1] && keywords[2]) {
                        const data2 = getChartForKw(keywords[1]);
                        const data3 = getChartForKw(keywords[2]);
                        if (data2.length && data3.length) {
                          const recent2 = data2.slice(-7).reduce((a, b) => a + b.interest, 0) / 7;
                          const recent3 = data3.slice(-7).reduce((a, b) => a + b.interest, 0) / 7;
                          const ratio = recent2 / recent3;
                          
                          let comparisonText = "";
                          let color = "";
                          
                          if (ratio > 1.5) {
                            comparisonText = `<strong>${keywords[1]}</strong> is significantly more popular than <strong>${keywords[2]}</strong>`;
                            color = "bg-green-500";
                          } else if (ratio < 0.67) {
                            comparisonText = `<strong>${keywords[1]}</strong> is significantly less popular than <strong>${keywords[2]}</strong>`;
                            color = "bg-red-500";
                          } else if (ratio > 1.2) {
                            comparisonText = `<strong>${keywords[1]}</strong> is more popular than <strong>${keywords[2]}</strong>`;
                            color = "bg-green-400";
                          } else if (ratio < 0.83) {
                            comparisonText = `<strong>${keywords[1]}</strong> is less popular than <strong>${keywords[2]}</strong>`;
                            color = "bg-red-400";
                          } else {
                            comparisonText = `<strong>${keywords[1]}</strong> has similar popularity to <strong>${keywords[2]}</strong>`;
                            color = "bg-blue-500";
                          }
                          
                          comparisons.push(
                            <div key="kw2-kw3" className="flex items-center">
                              <div className={`w-2 h-2 ${color} rounded-full mr-2`}></div>
                              <span dangerouslySetInnerHTML={{ __html: comparisonText }} />
                            </div>
                          );
                        }
                      }
                      
                      return comparisons.length > 0 ? comparisons : (
                        <div className="text-gray-500">Not enough data for comparison</div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-lg mb-2">No data to analyze</div>
            <div className="text-sm">Enter keywords and click "Analyze" to see trend insights</div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Comparison chart always full width */}
        <div className="bg-white p-6 rounded-xl shadow col-span-full">
          <h4 className="text-lg font-semibold mb-3">Comparison</h4>
          {combinedChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={combinedChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={tickFormatter} />
                <YAxis />
                <Tooltip />
                <Legend />
                {keywords.slice(0, visibleFields).map((kw, i) => (
                  <Line
                    key={kw}
                    type="monotone"
                    dataKey={kw}
                    stroke={i === 0 ? "#2563eb" : i === 1 ? "#059669" : "#dc2626"}
                    strokeWidth={i === 0 ? 3 : 2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-32 flex items-center justify-center text-gray-500">
              No comparison data.
            </div>
          )}
        </div>

        {/* Keyword 1 */}
        {separateCharts[0] && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h4 className="text-lg font-semibold mb-3">{separateCharts[0].kw}</h4>
            {separateCharts[0].data.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={separateCharts[0].data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={tickFormatter} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="interest" stroke="#2563eb" strokeWidth={2} dot={false} />
                  {separateCharts[0].anomalies.map((a, i) => (
                    <ReferenceLine key={i} x={a.date} stroke="#f97316" strokeDasharray="3 3" />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500 h-24 flex items-center justify-center">
                No data for {separateCharts[0].kw}
              </div>
            )}
          </div>
        )}

        {/* Keyword 2 */}
        {separateCharts[1] && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h4 className="text-lg font-semibold mb-3">{separateCharts[1].kw}</h4>
            {separateCharts[1].data.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={separateCharts[1].data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={tickFormatter} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="interest" stroke="#2563eb" strokeWidth={2} dot={false} />
                  {separateCharts[1].anomalies.map((a, i) => (
                    <ReferenceLine key={i} x={a.date} stroke="#f97316" strokeDasharray="3 3" />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500 h-24 flex items-center justify-center">
                No data for {separateCharts[1].kw}
              </div>
            )}
          </div>
        )}


        {/* Keyword 3 ALWAYS centered below Keyword 1 & 2 */}
        {separateCharts[2] && (
          <div className="col-span-full flex justify-center">
            <div className="bg-white p-6 rounded-xl shadow w-full md:w-[60%] lg:w-[50%]">
              <h4 className="text-lg font-semibold mb-3">{separateCharts[2].kw}</h4>
              {separateCharts[2].data.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={separateCharts[2].data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={tickFormatter} />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="interest"
                      stroke="#dc2626"
                      strokeWidth={2}
                      dot={false}
                    />
                    {separateCharts[2].anomalies.map((a, i) => (
                      <ReferenceLine
                        key={i}
                        x={a.date}
                        stroke="#f97316"
                        strokeDasharray="3 3"
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-gray-500 h-24 flex items-center justify-center">
                  No data for {separateCharts[2].kw}
                </div>
              )}
            </div>
          </div>
        )}

      </div>

    </div>

  );
}
