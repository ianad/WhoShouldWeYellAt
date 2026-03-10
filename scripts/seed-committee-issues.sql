-- Enrich issues table with comprehensive policy topics
-- Then map committees to relevant issues

-- Add new issues (ON CONFLICT to be idempotent)
INSERT INTO issues (name) VALUES
  -- Existing
  ('abortion'),
  ('drug prices'),
  ('climate change'),
  ('zoning'),
  ('taxes'),
  ('housing'),
  -- Agriculture & Food
  ('agriculture'),
  ('food safety'),
  ('rural development'),
  ('forestry'),
  -- Economy & Finance
  ('federal budget'),
  ('national debt'),
  ('trade'),
  ('tariffs'),
  ('inflation'),
  ('banking'),
  ('financial regulation'),
  ('cryptocurrency'),
  -- Healthcare
  ('healthcare'),
  ('medicare'),
  ('medicaid'),
  ('mental health'),
  ('opioids'),
  ('veterans healthcare'),
  -- Education
  ('education'),
  ('student loans'),
  ('school funding'),
  -- Labor & Workforce
  ('labor rights'),
  ('minimum wage'),
  ('workplace safety'),
  ('retirement'),
  ('social security'),
  -- Energy & Environment
  ('energy policy'),
  ('oil and gas'),
  ('nuclear energy'),
  ('renewable energy'),
  ('clean water'),
  ('air pollution'),
  ('public lands'),
  ('mining'),
  -- Defense & Security
  ('military'),
  ('defense spending'),
  ('cybersecurity'),
  ('homeland security'),
  ('border security'),
  ('terrorism'),
  ('intelligence'),
  -- Infrastructure & Transportation
  ('infrastructure'),
  ('roads and highways'),
  ('public transit'),
  ('aviation'),
  ('railroads'),
  ('broadband'),
  -- Justice & Civil Rights
  ('immigration'),
  ('gun control'),
  ('criminal justice reform'),
  ('civil rights'),
  ('voting rights'),
  ('privacy'),
  ('free speech'),
  -- Foreign Policy
  ('foreign policy'),
  ('foreign aid'),
  ('sanctions'),
  ('NATO'),
  -- Science & Technology
  ('space exploration'),
  ('science funding'),
  ('artificial intelligence'),
  ('internet regulation'),
  -- Social Programs
  ('welfare'),
  ('child care'),
  ('elder care'),
  ('disability rights'),
  -- Veterans
  ('veterans benefits'),
  -- Small Business
  ('small business'),
  -- Government
  ('government spending'),
  ('government accountability'),
  ('federal elections'),
  -- Native Americans
  ('tribal sovereignty'),
  ('Native American rights'),
  -- Drug Policy
  ('drug policy'),
  ('marijuana legalization')
ON CONFLICT (name) DO NOTHING;

-- Clear existing mappings and rebuild
TRUNCATE committee_issue;

-- Now map committees to issues
INSERT INTO committee_issue (committee_id, issue_id)
SELECT c.id, i.id FROM committees c, issues i
WHERE
  -- HSAG: House Agriculture
  (c.thomas_id = 'HSAG' AND i.name IN ('agriculture', 'food safety', 'rural development', 'forestry'))
  -- HSAP: House Appropriations
  OR (c.thomas_id = 'HSAP' AND i.name IN ('federal budget', 'government spending', 'defense spending'))
  -- HSAS: House Armed Services
  OR (c.thomas_id = 'HSAS' AND i.name IN ('military', 'defense spending', 'cybersecurity'))
  -- HSED: House Education and Workforce
  OR (c.thomas_id = 'HSED' AND i.name IN ('education', 'student loans', 'school funding', 'labor rights', 'minimum wage', 'workplace safety', 'child care'))
  -- HSIF: House Energy and Commerce
  OR (c.thomas_id = 'HSIF' AND i.name IN ('energy policy', 'oil and gas', 'nuclear energy', 'renewable energy', 'climate change', 'healthcare', 'drug prices', 'food safety', 'internet regulation', 'broadband', 'air pollution', 'opioids', 'mental health', 'abortion'))
  -- HSSO: House Ethics
  OR (c.thomas_id = 'HSSO' AND i.name IN ('government accountability'))
  -- HSBA: House Financial Services
  OR (c.thomas_id = 'HSBA' AND i.name IN ('banking', 'financial regulation', 'housing', 'zoning', 'cryptocurrency', 'inflation'))
  -- HSFA: House Foreign Affairs
  OR (c.thomas_id = 'HSFA' AND i.name IN ('foreign policy', 'foreign aid', 'sanctions', 'NATO'))
  -- HSHM: House Homeland Security
  OR (c.thomas_id = 'HSHM' AND i.name IN ('homeland security', 'border security', 'terrorism', 'cybersecurity'))
  -- HSHA: House Administration
  OR (c.thomas_id = 'HSHA' AND i.name IN ('federal elections', 'voting rights'))
  -- HSII: House Natural Resources
  OR (c.thomas_id = 'HSII' AND i.name IN ('public lands', 'mining', 'clean water', 'climate change', 'oil and gas', 'tribal sovereignty', 'Native American rights'))
  -- HSGO: House Oversight
  OR (c.thomas_id = 'HSGO' AND i.name IN ('government accountability', 'government spending'))
  -- HSSY: House Science, Space, and Technology
  OR (c.thomas_id = 'HSSY' AND i.name IN ('space exploration', 'science funding', 'climate change', 'artificial intelligence', 'renewable energy'))
  -- HSSM: House Small Business
  OR (c.thomas_id = 'HSSM' AND i.name IN ('small business'))
  -- HSBU: House Budget
  OR (c.thomas_id = 'HSBU' AND i.name IN ('federal budget', 'national debt', 'government spending', 'taxes'))
  -- HSJU: House Judiciary
  OR (c.thomas_id = 'HSJU' AND i.name IN ('immigration', 'gun control', 'criminal justice reform', 'civil rights', 'abortion', 'privacy', 'free speech', 'voting rights'))
  -- HSPW: House Transportation and Infrastructure
  OR (c.thomas_id = 'HSPW' AND i.name IN ('infrastructure', 'roads and highways', 'public transit', 'aviation', 'railroads', 'clean water', 'zoning'))
  -- HSVR: House Veterans' Affairs
  OR (c.thomas_id = 'HSVR' AND i.name IN ('veterans benefits', 'veterans healthcare'))
  -- HSWM: House Ways and Means
  OR (c.thomas_id = 'HSWM' AND i.name IN ('taxes', 'tariffs', 'trade', 'social security', 'medicare', 'drug prices', 'welfare', 'retirement'))
  -- HLIG: House Intelligence
  OR (c.thomas_id = 'HLIG' AND i.name IN ('intelligence', 'cybersecurity', 'terrorism'))
  -- SSAF: Senate Agriculture
  OR (c.thomas_id = 'SSAF' AND i.name IN ('agriculture', 'food safety', 'rural development', 'forestry'))
  -- SSAP: Senate Appropriations
  OR (c.thomas_id = 'SSAP' AND i.name IN ('federal budget', 'government spending', 'defense spending'))
  -- SSAS: Senate Armed Services
  OR (c.thomas_id = 'SSAS' AND i.name IN ('military', 'defense spending', 'cybersecurity'))
  -- SSBK: Senate Banking, Housing
  OR (c.thomas_id = 'SSBK' AND i.name IN ('banking', 'financial regulation', 'housing', 'zoning', 'cryptocurrency', 'inflation'))
  -- SSCM: Senate Commerce, Science, Transportation
  OR (c.thomas_id = 'SSCM' AND i.name IN ('broadband', 'internet regulation', 'aviation', 'railroads', 'science funding', 'space exploration', 'artificial intelligence', 'privacy'))
  -- SSEG: Senate Energy and Natural Resources
  OR (c.thomas_id = 'SSEG' AND i.name IN ('energy policy', 'oil and gas', 'nuclear energy', 'renewable energy', 'public lands', 'mining', 'clean water', 'tribal sovereignty'))
  -- SSEV: Senate Environment and Public Works
  OR (c.thomas_id = 'SSEV' AND i.name IN ('climate change', 'clean water', 'air pollution', 'infrastructure', 'roads and highways', 'public lands'))
  -- SSFI: Senate Finance
  OR (c.thomas_id = 'SSFI' AND i.name IN ('taxes', 'tariffs', 'trade', 'medicare', 'medicaid', 'social security', 'drug prices', 'healthcare', 'welfare', 'retirement'))
  -- SSFR: Senate Foreign Relations
  OR (c.thomas_id = 'SSFR' AND i.name IN ('foreign policy', 'foreign aid', 'sanctions', 'NATO'))
  -- SSHR: Senate Health, Education, Labor, Pensions
  OR (c.thomas_id = 'SSHR' AND i.name IN ('healthcare', 'drug prices', 'education', 'student loans', 'school funding', 'labor rights', 'minimum wage', 'workplace safety', 'retirement', 'opioids', 'mental health', 'abortion', 'child care', 'disability rights'))
  -- SSGA: Senate Homeland Security
  OR (c.thomas_id = 'SSGA' AND i.name IN ('homeland security', 'border security', 'cybersecurity', 'government accountability', 'government spending'))
  -- SLIA: Senate Indian Affairs
  OR (c.thomas_id = 'SLIA' AND i.name IN ('tribal sovereignty', 'Native American rights'))
  -- SSRA: Senate Rules and Administration
  OR (c.thomas_id = 'SSRA' AND i.name IN ('federal elections', 'voting rights'))
  -- SSSB: Senate Small Business
  OR (c.thomas_id = 'SSSB' AND i.name IN ('small business'))
  -- SSBU: Senate Budget
  OR (c.thomas_id = 'SSBU' AND i.name IN ('federal budget', 'national debt', 'government spending', 'taxes'))
  -- SSJU: Senate Judiciary
  OR (c.thomas_id = 'SSJU' AND i.name IN ('immigration', 'gun control', 'criminal justice reform', 'civil rights', 'abortion', 'privacy', 'free speech', 'voting rights'))
  -- SSVA: Senate Veterans' Affairs
  OR (c.thomas_id = 'SSVA' AND i.name IN ('veterans benefits', 'veterans healthcare'))
  -- SLIN: Senate Intelligence
  OR (c.thomas_id = 'SLIN' AND i.name IN ('intelligence', 'cybersecurity', 'terrorism'))
  -- SPAG: Senate Aging
  OR (c.thomas_id = 'SPAG' AND i.name IN ('elder care', 'social security', 'medicare', 'retirement'))
  -- SCNC: Senate Narcotics
  OR (c.thomas_id = 'SCNC' AND i.name IN ('drug policy', 'opioids', 'marijuana legalization'))
  -- JSTX: Joint Taxation
  OR (c.thomas_id = 'JSTX' AND i.name IN ('taxes'))
  -- JSEC: Joint Economic
  OR (c.thomas_id = 'JSEC' AND i.name IN ('inflation', 'trade', 'federal budget'))
ON CONFLICT DO NOTHING;
